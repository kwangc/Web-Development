var infoSheet = SpreadsheetApp.getActive().getSheetByName('Info')
var reqSheet = SpreadsheetApp.getActive().getSheetByName('Request')
var reqLogSheet = SpreadsheetApp.getActive().getSheetByName('Request Log')
var statusSheet = SpreadsheetApp.getActive().getSheetByName('Status')

var approvalEmail = infoSheet.getRangeList(['B1:AB1']).getRanges()[0].getValues()[0].filter(function(v,i){return v;})
var calendarId = infoSheet.getRange('B2').getValue()

function onNewForm(e) {
  Logger.log(e)
  if (e.namedValues['Categories']) {
    Logger.log('Requested')
    onNewRequest(e)
  }
  else {
    Logger.log('Approved')
    onNewApproval(e)
  }
}

function onNewRequest(e) {
  Logger.log('onNewRequest')
  var id = reqLogSheet.getLastRow()-1

  var timestamp = e.namedValues['타임스탬프'][0]
  var email = e.namedValues['이메일 주소'][0]
  var type = e.namedValues['Categories'][0]
  var startDate = Moment.moment(e.namedValues['Start Date'][0], 'YYYY.M.D')
  var startTime = e.namedValues['Start Time'][0]
  var endDate = Moment.moment(e.namedValues['End Date'][0], 'YYYY.M.D')
  var endTime = e.namedValues['End Time'][0]
  var reason = e.namedValues['Reason'][0]
  var duration = calcDiff(startDate, endDate, startTime, endTime)
  var user = AdminDirectory.Users.get(email)
  var name = user.name.givenName // name.fullName if you want to include last name
  var remained = vlookup(statusSheet, email, 1, 4)
  var remainedAfter
  if (type == 'Vacation') {
    remainedAfter = remained - duration
  }
  else {
    remainedAfter = remained
  }

  var start = startDate.format('YYYY-MM-DD')
  var end = endDate.format('YYYY-MM-DD')

  if (startTime == 'PM') {
    start += ' 15:00'
  }

  if (endTime == 'AM') {
    end += ' 15:00'
  }

  reqSheet.appendRow([id, name, timestamp, email, type, start, end, reason, duration, remained, remainedAfter, 'Pending'])
  sendRequestMail(email, id, timestamp, name, type, start, end, duration, remained, reason)
  sendApprovalMail(approvalEmail, id, timestamp, name, type, start, end, duration, remained, reason)
}

function onNewApproval(e) {
  id = e.namedValues['Number'][0]
  timestamp = Moment.moment()

  colnum = vlookup(reqSheet, id, 0, -1) + 1
  state = reqSheet.getRange(colnum, 12).getValue()
  if (state != 'Pending') {  // Update if pending
    return
  }

  var name = reqSheet.getRange(colnum, 2).getValue()
  var email = reqSheet.getRange(colnum, 4).getValue()
  var type = reqSheet.getRange(colnum, 5).getValue()
  var start = Moment.moment(reqSheet.getRange(colnum, 6).getValue())
  var end = Moment.moment(reqSheet.getRange(colnum, 7).getValue())
  var duration = reqSheet.getRange(colnum, 9).getValue()
  var colnum_status = vlookup(statusSheet, email, 1, -1) + 1
  var link;

  if (e.namedValues['Options'][0] == 'Approve') {
    result = 'Approved'
    if (type == 'Vacation') {
       used = statusSheet.getRange(colnum_status, 4).getValue()
       statusSheet.getRange(colnum_status, 4).setValue(used + duration)
    }
    link = regSchedule(email, type, name, start, end)
  }
  else {
    result = 'Rejected'
    if (e.namedValues['Reason'][0] != "") {
      result += ': ' + e.namedValues['Reason'][0]
    }
  }
  remained = statusSheet.getRange(colnum_status, 5).getValue()
  reqSheet.getRange(colnum, 12).setValue(result)
  reqSheet.getRange(colnum, 13).setValue(timestamp.format('YYYY-MM-DD HH:mm:ss'))
  reqSheet.getRange(colnum, 14).setValue(e.namedValues['이메일 주소'][0])
  sendResponseMail(email, id, name, result, remained, timestamp, link)
}

function regSchedule(email, type, name, start, end) {
  Logger.log('regSchedule')
  var calendar = CalendarApp.getCalendarById(calendarId);
  var title = name + ' ' + type
  var event;
  if (end.hour() == 0) {
    end.add(1, 'd')
  }
  if (start.hour() == 0 && end.hour() == 0) {
    event = calendar.createAllDayEvent(title, start.toDate(), end.toDate())
  }
  else {
    event = calendar.createEvent(title, start.toDate(), end.toDate())
  }

  var link = "https://calendar.google.com/calendar/r/month/" + start.year() + "/" + (start.month()+1) + "/1?tab=wc"
  return link;

}

function sendRequestMail(emailAddress, id, timestamp, name, type, startDate, endDate, duration, remained, reason) {
  subject = 'Your leave request is submitted.'

  body = '<h3>Your leave request is well submitted.</h3>'
  body += '<table style="border-collapse: collapse;">'
  body += '<tr><td>No.</td><td>'+ id +'</td></tr>'
  body += '<tr><td>Time requested</td><td>'+ timestamp +'</td></tr>'
  body += '<tr><td>Name</td><td>'+ name +'</td></tr>'
  body += '<tr><td>Categories</td><td>'+ type +'</td></tr>'
  body += '<tr><td>Start Date</td><td>'+ startDate +'</td></tr>'
  body += '<tr><td>End Date</td><td>'+ endDate +'</td></tr>'
  body += '<tr><td>Duration</td><td>'+ duration +' day(s)</td></tr>'
  if (type=='Vacation') {
    body += '<tr><td>Current number of leaves</td><td>'+ remained +' day(s)</td></tr>'
    body += '<tr><td>Remaining leaves</td><td>'+ (
      remained-duration) +' day(s)</td></tr>'
  }
  body += '<tr><td>Reason</td><td>'+ reason +'</td></tr>'
  body += '</table>'

  body += '<p>An email will be sent if your request is processed.</p>'
  body = body.split('<tr><td>').join('<tr><td style="border: 1px solid #ddd; font-weight: bold; padding: 10px; width: 1px; white-space: nowrap;">')
  body = body.split('</td><td>').join('</td><td style="border: 1px solid #ddd; padding: 10px">')

  MailApp.sendEmail({
    to: emailAddress,
    subject: subject,
    htmlBody: body
  });
}

function sendApprovalMail(emailAddress, id, timestamp, name, type, startDate, endDate, duration, remained, reason) {
  subject = name + '의 새로운 휴가 신청'
  link = 'https://docs.google.com/a/lineable.net/forms/d/e/1FAIpQLScH6Fn07qqa-9Yaee9jPAjlaqlxDTWa6iYvvJvxIfVvBY_QIw/viewform?usp=pp_url&entry.1927534531='+ id

  body = '<h3>' + name +'님으로부터 새 휴가 신청이 있습니다.</h3>'
  body += '<table style="border-collapse: collapse;">'
  body += '<tr><td>신청번호</td><td>'+ id +'</td></tr>'
  body += '<tr><td>신청시간</td><td>'+ timestamp +'</td></tr>'
  body += '<tr><td>신청자</td><td>'+ name +'</td></tr>'
  body += '<tr><td>종류</td><td>'+ type +'</td></tr>'
  body += '<tr><td>휴가 시작일</td><td>'+ startDate +'</td></tr>'
  body += '<tr><td>휴가 종료일</td><td>'+ endDate +'</td></tr>'
  body += '<tr><td>기간</td><td>'+ duration +'일</td></tr>'
  if (type=='Vacation') {
    body += '<tr><td>현재 잔여 연차</td><td>'+ remained +'일</td></tr>'
  }
  body += '<tr><td>사유</td><td>'+ reason +'</td></tr>'
  body += '</table>'

  body += '<p>승인/반려를 하시려면 <a href=\"'+ link +'\">여기</a>를 클릭해주세요</p>'
  body = body.split('<tr><td>').join('<tr><td style="border: 1px solid #ddd; font-weight: bold; padding: 10px; width: 1px; white-space: nowrap;">')
  body = body.split('</td><td>').join('</td><td style="border: 1px solid #ddd; padding: 10px">')

  emailAddress.map(function(email, i) {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });
  })
}

function sendResponseMail(email, id, name, result, remained, timestamp, link) {
  subject = 'Leave request result'
  body = '<h3>This email is to notify the result of your leave request.</h3>'
  body += '<table style="border-collapse: collapse;">'
  body += '<tr><td>No.</td><td>'+ id +'</td></tr>'
  body += '<tr><td>Result</td><td><b>'+ result +'</b></td></tr>'
  body += '<tr><td>Processed date</td><td>'+ timestamp.format('YYYY-MM-DD HH:mm:ss') +'</td></tr>'
  body += '<tr><td>Remaining leaves</td><td>'+ remained +'day(s)</td></tr>'
  body += '</table>'
  if (result == 'Approved' && link) {
    body += '<p>Your leave schedule is created in the calendar. <a href=\"'+ link +'\">[Check]</a></p>'
  }
  body += '<p>Feel free to contact me if you have questions</p>'
  body = body.split('<tr><td>').join('<tr><td style="border: 1px solid #ddd; font-weight: bold; padding: 10px; width: 1px; white-space: nowrap;">')
  body = body.split('</td><td>').join('</td><td style="border: 1px solid #ddd; padding: 10px">')

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: body
  });
}

function calcDiff(startDate, endDate, startTime, endTime) {
  startTime = startTime=='AM'?0:1
  endTime = endTime=='AM'?0:1
  if (startDate.isAfter(endDate)) {
    return -1
  }

  holidays = readHolidays(startDate, endDate)
  var diff = 0
  thisday = startDate.clone()
  while (!endDate.isBefore(thisday)) {
    if ([0,6].indexOf(thisday.day()) <= -1) { // 주말
      if (holidays.indexOf(thisday.format('YYYYMMDD')) <= -1) { // 공휴일
        diff++
      }
    }
    thisday = thisday.add(1, 'd')
  }

  if (startTime == 1) {
    diff -= 0.5
  }

  if (endTime == 0) {
    diff -= 0.5
  }

  return diff
}

function vlookup(sheet, value, cnum, tnum) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  for (var i = 0; i < values.length; i++) {
    if (values[i][cnum] == value) {
      if (tnum < 0) {
        return i
      }
      else {
        return values[i][tnum]
      }
    }
  }
}

function readHolidays(startDate, endDate) {
  var holidaySheet = SpreadsheetApp.getActive().getSheetByName('Holidays')
  var dataRange = holidaySheet.getDataRange()
  var values = dataRange.getValues()
  var holidays = []
  var on = false

  for (var i = 0; i < values.length; i++) {
    year = values[i][0]
    date = values[i][1]
    holiday = Moment.moment(year+' '+date, 'YYYY MMM D')
    if (holiday.isAfter(startDate)) {
      on = true
    }
    if (endDate.isBefore(holiday)) {
      on = false
    }
    if (on) {
      holidays.push(holiday.format('YYYYMMDD'))
    }
  }
  return holidays
}

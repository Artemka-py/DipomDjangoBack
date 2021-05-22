import os
import smtplib
import sys
from email import encoders
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate
import datetime
import time
import schedule

#Отправка логов на почту главному разработчику
def send_logs():
    #Выбор хоста почты, авторизация
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login('i_a.n.litkin@mpt.ru', 'vcznjrmnunrpzngj')
    #Заголовок письма
    subject = 'Логи'
    sender_from = 'i_a.n.litkin@mpt.ru'
    msg = MIMEMultipart()
    msg["From"] = sender_from
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=True)
    
    #Прикрепление файла к письму
    file_to_attach = '../testDiplom\errors.log'
    header = 'Content-Disposition', 'attachment; filename="%s"' % file_to_attach
    attachment = MIMEBase('application', "octet-stream")
    
    #Попытка считать файл
    try:
        with open(file_to_attach, "rb") as fh:
            data = fh.read()
        
        attachment.set_payload( data )
        encoders.encode_base64(attachment)
        attachment.add_header(*header)
        msg.attach(attachment)
    except IOError:
        msg = "Error opening attachment file %s" % file_to_attach
        print(msg)
        sys.exit(1)

    #Отправка составленного письма
    s.sendmail(sender_from, sender_from, msg.as_string())
    s.quit()

#Удаление старых бэкапов БД и создание новых
def create_backup():
    os.system('.\\deleteBackup.bat')
    os.system('.\\backupCreate.bat')

#Создание расписания выполнения функций
schedule.every().day.at('23:59:00').do(send_logs)
schedule.every().day.at('23:59:00').do(create_backup)

#Запуск расписания
while True:
    schedule.run_pending()
    time.sleep(1)
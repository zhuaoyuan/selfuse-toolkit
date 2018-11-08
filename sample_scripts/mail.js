const nodemailer = require("nodemailer");
const config = require("./config");
const Imap = require('imap');
const MailParser = require("mailparser").MailParser;
const fs = require("fs");
const date = require("./date");

// 发送邮件
module.exports.sendMail = function(title, content, receiver, attachments, retryTime) {
    // 开启一个 SMTP 连接池
    let smtpTransport = nodemailer.createTransport({
        host: "", // 主机
        secureConnection: true, // 使用 SSL
        port: 465, // SMTP 端口
        auth: {
            user: "", // 账号
            pass: "" // 密码
        }
    });

    // 设置邮件内容
    let mailOptions = {
        from: "", // 发件地址
        to: receiver,// 收件列表
        subject: title, // 标题
        html: content, // html 内容
        attachments: attachments
    };

    function retryableSend(mailOptions, retryTime) {
        if(retryTime <= 0){
            return;
        }
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.error(error,"retryTime="+retryTime);
                retryTime--;
                retryableSend(mailOptions, retryTime);
            } else {
                // response.message
                console.log("Message sent!");
                smtpTransport.close(); // 如果没用，关闭连接池
            }
        });
    }

    if(retryTime == undefined) {
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.error(error);
            } else {
                // response.message
                console.log("Message sent!");
            }
            smtpTransport.close(); // 如果没用，关闭连接池
        });
    } else {
        retryableSend(mailOptions, retryTime);
    }

};

module.exports.getMailTitles = function (criteria, callback) {

    let resultArray = [];
    let imap = new Imap({
        user: config.pddMailAddress, //你的邮箱账号
        password: config.pddMailPassword, //你的邮箱密码
        host: 'imap.exmail.qq.com', //邮箱服务器的主机地址
        port: 993, //邮箱服务器的端口地址
        tls: true, //使用安全传输协议
    });

    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
    }
    imap.once('ready', function() {
        openInbox(function(err, box) {
            console.log("Open mailbox.");
            if (err) throw err;
            imap.search(criteria, function(err, results) {
                if (err) throw err;
                if (results.length == 0){
                    console.log("No mails searched.");
                    imap.end();
                    callback(resultArray);
                } else {
                    let f = imap.fetch(results, {bodies: ''});
                    f.on('message', function (msg, seqno) {
                        let mailparser = new MailParser();
                        msg.on('body', function (stream, info) {
                            stream.pipe(mailparser);//将为解析的数据流pipe到mailparser
                            //邮件头内容
                            mailparser.on("headers", function (headers) {
                                resultArray.push(headers.get('subject'));
                                // console.log("邮件主题: " + headers.get('subject'));
                            });
                        });
                    });
                    f.once('error', function (err) {
                        console.log('[GET MAIL ERROR]' + err);
                    });
                    f.once('end', function () {
                        console.log('Grasp finish.');
                        imap.end();
                        callback(resultArray);
                    });
                }
            });
        });
    });

    imap.once('error', function(err) {
        console.log(err);
    });

    imap.once('end', function() {
        console.log('Close mailbox.');
    });

    imap.connect();
};

module.exports.syncGetMailTitles = function (criteria) {

    return new Promise(function (resolve, reject) {

        let resultArray = [];
        let imap = new Imap({
            user: "", //你的邮箱账号
            password: "", //你的邮箱密码
            host: '', //邮箱服务器的主机地址
            port: 993, //邮箱服务器的端口地址
            tls: true, //使用安全传输协议
        });

        function openInbox(cb) {
            imap.openBox('INBOX', true, cb);
        }
        imap.once('ready', function() {
            openInbox(function(err, box) {
                console.log("Open mailbox.");
                if (err) throw err;
                imap.search(criteria, function(err, results) {
                    if (err) throw err;
                    if (results.length == 0){
                        console.log("No mails searched.");
                        imap.end();
                        resolve(resultArray);
                    } else {
                        let f = imap.fetch(results, {bodies: ''});
                        f.on('message', function (msg, seqno) {
                            let mailparser = new MailParser();
                            msg.on('body', function (stream, info) {
                                stream.pipe(mailparser);//将为解析的数据流pipe到mailparser
                                //邮件头内容
                                mailparser.on("headers", function (headers) {
                                    resultArray.push(headers.get('subject'));
                                    // console.log("邮件主题: " + headers.get('subject'));
                                });
                            });
                        });
                        f.once('error', function (err) {
                            console.log('[GET MAIL ERROR]' + err);
                        });
                        f.once('end', function () {
                            console.log('Grasp finish.');
                            imap.end();
                            resolve(resultArray);
                        });
                    }
                });
            });
        });

        imap.once('error', function(err) {
            console.log(err);
        });

        imap.once('end', function() {
            console.log('Close mailbox.');
        });

        imap.connect();
    })

};
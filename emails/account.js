const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key:process.env.MAILAPI});

const welcomEmail= (email,name)=>{mg.messages.create(process.env.MAILDOMAIN, {
	from: "ukashaaltaf267@gmail.com",
	to: [`${email}`],
	subject: "Welcome Mail",
	text: `Hi ${name}, we warmly welcom you on our App. We hope you'will enjoy this/`
	// html: "<h1>Testing some Mailgun awesomeness!</h1>"
}).then(msg => console.log(msg)) 
.catch(err => console.log(err)); 
 
}

const   exitEmail= (email,name)=>{mg.messages.create(process.env.MAILDOMAIN, {
	from: "ukashaaltaf267@gmail.com",
	to: [`${email}`],
	subject: "Welcome Mail",
	text: `Goodbye! ${name},we hope you enjoyed the journey with us`
	// html: "<h1>Testing some Mailgun awesomeness!</h1>"
}).then(msg => console.log(msg)) 
.catch(err => console.log(err)); 
 
}

module.exports= {
    exitEmail,
    welcomEmail
}


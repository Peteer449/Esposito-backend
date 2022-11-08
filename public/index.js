//Generate a template
const template = Handlebars.compile(`
  <ul>
    <li>{{name}}</li>
    <li>{{lastName}}</li>
    <li>{{age}}</li>
  </ul>
`)

//Generate html with template and data
const html = template({
  name:"Pedro",
  lastName:"Esposito",
  age:23
})

document.getElementById("container").innerHTML = html
$(document).foundation()

class Megaroster {
  constructor(listSelector) {
    this.studentList = document.querySelector(listSelector)
    this.students = []
    this.max = 0
    this.setupEventListeners()
    this.load()
  }

  setupEventListeners() {
    document
      .querySelector('#new-student')
      .addEventListener('submit', this.addStudentViaForm.bind(this))
  }

  save() {
    localStorage.setItem('roster', JSON.stringify(this.students))
  }

  load() {
    const rosterString = localStorage.getItem('roster')
    if (rosterString) {
      const rosterArray = JSON.parse(rosterString)
      rosterArray
        .reverse()
        .map(this.addStudent.bind(this))
    }
  }

  removeStudent(ev) {
    const btn = ev.target
    const li = btn.closest('.student')

    for (let i=0; i < this.students.length; i++) {
      let currentId = this.students[i].id.toString()
      if (currentId === li.dataset.id) {
        this.students.splice(i, 1)
        break
      }
    }

    li.remove()
    this.save()
  }

  promoteStudent(student, ev) {
    const btn = ev.target
    const li = btn.closest('.student')
    student.promoted = !student.promoted

    if (student.promoted) {
      li.classList.add('promoted')
    } else {
      li.classList.remove('promoted')
    }
    
    this.save()
  }

  addStudentViaForm(ev) {
    ev.preventDefault()
    const f = ev.target
    const student = {
      id: this.max + 1,
      name: f.studentName.value,
    }
    this.addStudent(student)
    f.reset()
  }

  addStudent(student, append) {
    this.students.unshift(student)

    const listItem = this.buildListItem(student)
    this.prependChild(this.studentList, listItem)

    if (student.id > this.max) {
      this.max = student.id
    }
    this.save()
  }

  edit(student, ev) {
    const btn = ev.target
    const i = btn.firstElementChild
    const li = btn.closest('.student')
    const span = li.firstElementChild
    const attr = span.attributes
    const ni = attr[1].value
    

    if(ni == 'false') {
      span.setAttribute('contenteditable', 'true')
    } else {
      span.setAttribute('contenteditable', 'false')
    }
    btn.success = !btn.success
    
    if(btn.success){
      btn.classList.add('success')
      i.classList.add('fa-check-circle')
    } else {
      btn.classList.remove('success')
      i.classList.remove('fa-check-circle')
    }

    i.faCheckCircle = !i.faCheckCircle

    if(i.faCheckCircle){
        i.classList.add('fa-check-circle')
      } else {
        i.classList.remove('fa-check-circle')
      }

    this.change(ev)
    this.save()
  }

  change(ev) {
    const btn = ev.target
    const i = btn.firstElementChild
    const li = btn.closest('.student')
    const span = li.firstElementChild
    const txt = span.innerText

    for (let i = 0; i < this.students.length; i++) {
      if(this.students[i].name !== span.innerText && this.students[i].id == li.dataset.id) {
        this.students[i].name = span.innerText
        break
      }
      
    }
  }

  prependChild(parent, child) {
    parent.insertBefore(child, parent.firstChild)
  }

  buildListItem(student) {
    const template = document.querySelector('.student.template')
    const li = template.cloneNode(true)
    this.removeClassName(li, 'template')
    li.querySelector('.student-name').textContent = student.name
    li.dataset.id = student.id

    if(student.promoted) {
      li.classList.add('promoted')
    }

    this.setupActions(li, student)
    return li
  }

  setupActions(li, student) {
    li
      .querySelector('button.edit')
      .addEventListener('click', this.edit.bind(this, student))
    li
      .querySelector('button.remove')
      .addEventListener('click', this.removeStudent.bind(this))

    li
      .querySelector('button.promote')
      .addEventListener('click', this.promoteStudent.bind(this, student))

    li
      .querySelector('button.move-up')
      .addEventListener('click', this.moveUp.bind(this, student))
    li
      .querySelector('button.move-down')
      .addEventListener('click', this.moveDown.bind(this, student))
  }

  moveUp(student, ev) {
    const btn = ev.target
    const li = btn.closest('.student')

    const index = this.students.findIndex((currentStudent, i) => {
      return currentStudent.id === student.id
    })

    if (index > 0) {
      this.studentList.insertBefore(li, li.previousElementSibling)

      const previousStudent = this.students[index - 1]
      this.students[index - 1] = student
      this.students[index] = previousStudent

      this.save()
    }
  }

  moveDown(student, ev) {
    const btn = ev.target
    const li = btn.closest('.student')

    const index = this.students.findIndex((currentStudent, i) => {
      return currentStudent.id === student.id
    })

    const next = li.nextElementSibling
    const after = next.nextElementSibling


    if (index < this.students.length - 1){
        this.studentList.insertBefore(li, after)

        const afterStudent = this.students[index + 1]
        this.students[index + 1] = student
        this.students[index] = afterStudent

        this.save()
    }
  }

  removeClassName(el, className){
    el.className = el.className.replace(className, '').trim()
  }
}
const roster = new Megaroster('#studentList')

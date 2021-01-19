/**
 * As of now form has a single form and users can only add one member at a time, although code is written 
 * to accommodate multiple members in one go. Considering, DOM elements are named as is and there is only 
 * one button to add and submit. Alerts are intrusive but does the job. I'd rather remove alerts and add 
 * dynamic elements for messaging.
 * @author Ritesh Patel
 */
"use strict"

// table columns
var columns = ["AGE", "RELATIONSHIP", "SMOKER", "ACTION"]

// collection to hold household members
var members = [] 

// get handle on form and button
var form = document.querySelector("form")
var btn = document.querySelector(".add")

/**
 * add button handler
 * @param {*} event 
 */
function addHandler (event) {
    event.preventDefault() 

    // get dom elements
    var ageElements = document.getElementsByName("age")
    var relElements = document.getElementsByName("rel")
    var smokeElements = document.getElementsByName("smoker")

    // hide pre element (if visible)
    var preEle = document.getElementsByTagName("pre")[0]
    preEle.style.display = "none"

    // set members collection
    setMembers(ageElements, relElements, smokeElements)

    // display members in a html table
    if (members.length > 0) {
        showMembers()
    }

    form.reset()
}

/**
 * submit button handler
 * @param {*} event 
 */
function submitHandler (event) {
    event.preventDefault()
    submitForm(event)
}

/**
 * click event listener for the add button
 */
var addHandler = btn.addEventListener("click", addHandler)

/**
 * click handler for the submit button
 */
var submitHandler = form.addEventListener('submit', submitHandler)

/**
 * helper function to set attributes on dynamic dom elements
 * @param {*} el 
 * @param {*} attrs 
 */
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key])
    }
}

/**
 * sets a placeholder table
 */
function setTable () {
    if (document.getElementsByName("results").length === 0) {
        var table = document.createElement('table')
        setAttributes(table, {
            "name": "results"   
        })
        document.body.appendChild(table)
    }
}

/**
 * adds a member to collection
 * @param {*} age - age
 * @param {*} rel - relationship
 * @param {*} smoke - smoke indicator
 */
function addMember (age, rel, smoke) {
    var isAgeValid = checkAge(age)
    if (!isAgeValid) return 

    var isRelValid = checkRelationship(rel) 
    if (!isRelValid) return 

    members.push({
        AGE: parseInt(age), 
        REL: rel,
        SMOKER: smoke.checked ? "YES" : "NO",
        ACTION: ""
    })
}

/**
 * called when ADD button is clicked. If multiple forms are added 
 * this function takes care of adding all members in a one go.
 * @param {*} ageElements 
 * @param {*} relElements 
 * @param {*} smokeElements 
 */
function setMembers (ageElements, relElements, smokeElements) {
    for (var i = 0; i < ageElements.length; i++) {
        var age = ageElements[i].value || 0
        var rel = relElements[i].value || ""
        var smoke = smokeElements[i]
        addMember(age, rel, smoke)
    }
}

/**
 * clears table and console table
 * @param {*} table 
 */
function clearTable (table) {
    console.clear()
    table.innerHTML = ""
}

/**
 * shows members in a html table
 */
function showMembers () {
    // create table if one doesn't exist
    setTable()
    var elements = document.getElementsByName("results")
    if (elements.length > 0) {
        var table = elements[0]
        clearTable(table)
    
        // create remove button
        var btn = document.createElement("input")
        setAttributes(btn, {
            "type": "button",
            "value": "Remove"
        })
        btn.addEventListener("click", function(event) {
            if (confirm('Are you sure you wish to remove this household member?')) {
                members.pop() 
                showMembers()
            }
        })
    
        if (members.length > 0) {
            table.style.display = "table"
            var header = table.insertRow() 
            for (var i = 0; i < columns.length; i++) {
                var cell = header.insertCell() 
                cell.innerHTML = columns[i]
            }    
        } else {
            table.style.display = "none"
        }
    
        for (var m = 0; m < members.length; m++) {
            var row = table.insertRow()
            var member = members[m]
    
            for (var key in member) {
                // only add a remove button to the last row
                if (m === members.length - 1 && key === "ACTION") {
                    var cell = row.insertCell() 
                    cell.appendChild(btn)
                } else {
                    var cell = row.insertCell() 
                    cell.innerHTML = member[key]
                }
            }
        }
        // add table to console 
        console.table(members)
    }
}

/**
 * checks age
 * @param {*} age 
 */
function checkAge (age) {
    var isnum = /^\d+$/.test(age);

    if (!isnum) {
        alert('Age can only be in numbers :)')
        return
    }
    var valid = age > 0 

    if (!valid) {
        alert('Age must be greater than 0 :)')
    }

    return valid
}

/**
 * checks relationship
 * @param {*} rel 
 */
function checkRelationship (rel) {
    var valid = rel.length > 0

    if (!valid) {
        alert('Relationship is a required field, please select a value')
    }

    return rel.length > 0
}

/**
 * hide table on submit
 */
function hideTable () {
    var elements = document.getElementsByName("results")
    if (elements.length > 0) {
        var table = elements[0]
        table.style.display = "none"
    }
}

/**
 * displays json
 */
function displayJson () {
    var debugEle = document.getElementsByTagName("pre")[0]

    if (members.length > 0) {
        debugEle.style.cssText = "display:block; \
                                    width: 300px; \
                                    background-color: #404040; \
                                    color:white; \
                                    overflow: auto; \
                                    height: 200px; \
                                    margin: 0 auto; \
                                    margin-top: 10px; \
                                    border: 1px solid #404040; \
                                    border-radius: 5px; \
                                    text-align:left"
                                    
        debugEle.innerHTML = JSON.stringify(members, null, 2)
    } else {
        debugEle.style.display = "none"
        debugEle.innerHTML = ""
    }
}

/**
 * submits form
 * @param {*} event 
 */
function submitForm (event) {
    var formData = new FormData(event.target)
    var age = formData.get("age") || 0
    var rel = formData.get("rel") || ""
    var smoker = formData.get("smoker") || "off"

    smoker = smoker === "off" ? "NO" : "YES"
    addMember(age, rel, smoker)

    // display JSON in console
    hideTable()
    displayJson()
    form.reset()
}

/**
 * prettify form elements / table. just some extras!
 */
function prettifyPage () {
    var sheet = document.createElement('style')
    sheet.innerHTML = "body { font-family: sans-serif, helvetica, verdana; width: 80%; margin: 0 auto; text-align: center}" +
                      "input {padding: 5px; border-radius: 5px; margin-bottom: 5px;} " + 
                      "label { font-weight: bold } select { padding: 5px; border-radius: 5px } " + 
                      "button { padding: 5px; border: 2px solid #CCC; border-radius: 5px; margin-top: 5px; text-transform: capitalize } " +
                      "table { border: 1px solid #CCC; padding: 5px; margin: 0 auto; margin-top: 10px; border-radius: 5px; text-align: center;} " +
                      "table tr:nth-child(even) td { background-color: #eee }" + 
                      "table tr:first-child { background-color: #404040; color: white } " +
                      "h1 { text-transform: uppercase } " + 
                      "td { padding: 5px }" + 
                      "form { width: 300px; border: 2px solid #404040; background-color: #eee; border-radius: 5px; padding: 10px; margin: 0 auto; text-align: left;" + 
                      "pre.debug { width: 300px; border-radius: 5px; border: 1px solid #404040; background-color: #eee; padding: 5px; text-align: left } "
    document.body.appendChild(sheet)
}

prettifyPage() 

// clear listeners on page unload
window.onunload = function () {
    document.body.removeEventListener("click", addHandler)
    document.body.removeEventListener("submit", submitHandler)
}

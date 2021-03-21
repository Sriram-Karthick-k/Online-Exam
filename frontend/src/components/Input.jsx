import React from "react"

function Input(props) {
  var classname = "input border-bottom " + props.class
  if (props.autofocus === "true") {
    return (
      <div className="Input form__group">
        <input autoComplete={props.autocomplete} value={props.value} onBlur={props.onblur} placeholder={props.placeholder} onClose={props.onClose} id={props.id} className={classname} onChange={props.onchange} name={props.name} onClick={props.onclick} type={props.type} required autoFocus />
        <label for={props.for} class="form__label">{props.lableText}</label>
      </div>
    )
  }
  if (props.autofocus === "false") {
    return (
      <div className="Input form__group">
        <input autoComplete={props.autocomplete} value={props.value} onBlur={props.onblur} placeholder={props.placeholder} onClose={props.onClose} id={props.id} className={classname} onChange={props.onchange} name={props.name} onClick={props.onclick} type={props.type} required />
        <label for={props.for} class="form__label">{props.lableText}</label>
      </div>
    )
  }
}
export default Input

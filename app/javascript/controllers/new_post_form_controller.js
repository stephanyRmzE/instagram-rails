import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="new-post-form"
export default class extends Controller {
  connect() {

    console.log("is workinggggg")
  }

  selectFromComputer() {
    this.element.querySelector("input[type='file']").click();
  }
}

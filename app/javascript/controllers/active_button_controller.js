import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["topButton", "categoryButton", "feed"];

  connect() {
    this.#handleButtons(this.topButtonTargets, "filter");
    this.#handleButtons(this.categoryButtonTargets, "category");
  }

  /* --------------------------------- Private -------------------------------- */
  #getFormattedPath(button, params) {
    if (params === "category") {
      console.log(button);
      return button.children[1].innerText.toLowerCase();
    } else {
      console.log(button);
      const path = button.innerText.replace(/\s/g, "");
      return path.toLowerCase();
    }
  }

  #updateMap(res) {
    const map = document.querySelector("#mapbox");
    map.outerHTML = res;
  }

  #fetchHome(path, params, options) {
    fetch(`/?${params}=${path}`, options).then((response) =>
      response.text().then((responseText) => {
        this.#updateMap(responseText);
        history.pushState(null, null, `/?${params}=${path}`);
      })
    );
  }

  #fetchFeed(path, params, options) {
    fetch(`/feed/?${params}=${path}`, options).then((response) =>
      response.text().then((responseText) => {
        this.feedTarget.outerHTML = responseText;
        history.pushState(null, null, `/feed/?${params}=${path}`);
      })
    );
  }

  #fetchData(e, params) {
    const options = {
      method: "GET",
      headers: {
        Accept: "text/plain",
      },
    };

    const path = this.#getFormattedPath(e.currentTarget, params);

    this.#isInFeedPage() ? this.#fetchFeed(path, params, options) : this.#fetchHome(path, params, options);
  }

  #isInFeedPage() {
    return (/\/feed.*/).test(window.location.pathname);
  }

  #handleButtons(targets, params) {
    targets.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.#fetchData(e, params);
        targets.forEach((sibling) => {
          sibling.classList.remove("active");
        });
        button.classList.add("active");
      });
    });
  }
}

import * as path from 'path';

/**
 * This extension includes the required markup and scripts required for
 * a header at the top of the slides.
 */
function header (registry : any) {
  registry.postprocessor(function () {
    let self : any = this;
    self.process(function (doc : any, output : any) {
      const text = `
<div id="slides-header" class="header"></div>

<script type="text/javascript">
window.addEventListener("load", function() {
  revealDiv = document.querySelector("body div.reveal")
  header = document.getElementById("slides-header");
  revealDiv.appendChild(header);
});
</script>`
      return output.replace('</body>', `${text}</body>`)
    })
  })
}

module.exports = {
  register: header
}

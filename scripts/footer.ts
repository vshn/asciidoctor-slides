/**
 * This extension includes the required markup and scripts required for
 * the VSHN-branded footer at the bottom of the slides.
 */
function footer (registry) {
  registry.postprocessor(function () {
    var self = this
    self.process(function (doc, output) {
      console.log('Applying footer tree processor')
      const text = `
<div id="vshn-footer" class="footer">
  <span class="element"><img src="assets/images/vshn_footer.png"></span>
  <span class="element">VSHN – The DevOps Company</span>
  <span class="element">&nbsp;</span>
</div>

<script type="text/javascript">
window.addEventListener("load", function() {
  revealDiv = document.querySelector("body div.reveal")
  footer = document.getElementById("vshn-footer");
  revealDiv.appendChild(footer);
});
</script>`
      return output.replace('</body>', `${text}</body>`)
    })
  })
}

module.exports = {
  register: footer
}

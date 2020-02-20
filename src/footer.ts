import * as path from 'path';

/**
 * This extension includes the required markup and scripts required for
 * a footer at the bottom of the slides.
 */
function footer (registry : any) {
  registry.postprocessor(function () {
    let self : any = this;
    self.process(function (doc : any, output : any) {
      const footerText = doc.getAttribute('footer-text', 'VSHN – The DevOps Company');
      const footerImage = doc.getAttribute('footer-image', 'vshn_footer.png');
      const imagesDir = doc.getAttribute('imagesdir');
      const footerPath = path.join(imagesDir, footerImage);
      const text = `
<div id="slides-footer" class="footer">
  <span class="element"><img src="${footerPath}"></span>
  <span class="element">${footerText}</span>
  <span class="element">&nbsp;</span>
</div>

<script type="text/javascript">
window.addEventListener("load", function() {
  revealDiv = document.querySelector("body div.reveal")
  footer = document.getElementById("slides-footer");
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

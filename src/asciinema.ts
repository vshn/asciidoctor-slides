/**
 * This extensions adds the required includes for
 * Asciinema movies at the end of the presentation.
 */
function asciinema (registry : any) {
  registry.postprocessor(function () {
    let self : any = this;
    self.process(function (doc : any, output : any) {
      const text = `<link rel="stylesheet" href="node_modules/asciinema-player/resources/public/css/asciinema-player.css">
<script src="node_modules/asciinema-player/resources/public/js/asciinema-player.js"></script>`
      return output.replace('</body>', `${text}</body>`)
    })
  })
}

module.exports = {
  register: asciinema
}

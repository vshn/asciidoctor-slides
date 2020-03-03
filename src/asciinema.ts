/**
 * Used to specify the parameters of an Asciinema block
 */
interface AsciinemaBlockParameters {
  src: string
  poster: string
  cols: string
  rows: string
  idleTimeLimit: string
  speed: string
  fontSize: string
  theme: string
}

/**
 * Returns an object with all defaults set
 * @param src The path to the source of the Asciinema movie
 * @param attrs The attributes passed in the Asciidoctor source
 */
function createAsciinemaBlockParameters(src: string, attrs: any = {}): AsciinemaBlockParameters {
  return {
    src: src,
    poster: attrs.poster || 'npt:0:0',
    cols: attrs.cols || '86',
    rows: attrs.rows || '21',
    idleTimeLimit: attrs.idleTimeLimit || '1',
    speed: attrs.speed || '1.1',
    fontSize: attrs.fontSize || 'medium', // small, medium, big
    theme: attrs.theme || 'tango'         // asciinema, tango, solarized-dark, solarized-light, monokai
  }
}

/**
 * Creates a block used to display an Asciinema movie
 * @param parameters The parameters for the requested block
 */
function asciinemaBlock(parameters: AsciinemaBlockParameters) {
  let result = `<asciinema-player
  src="${parameters.src}"
  cols="${parameters.cols}"
  rows="${parameters.rows}"
  idle-time-limit="${parameters.idleTimeLimit}"
  poster="${parameters.poster}"
  speed="${parameters.speed}"
  font-size="${parameters.fontSize}"
  theme="${parameters.theme}">
</asciinema-player>`
  return result
}

/**
 * This extension allows for the use of the `asciinema::` block object
 * and adds the required includes for Asciinema movies at the end of the HTML.
 */
function asciinema (registry : any) {
  registry.blockMacro(function () {
    let self = this
    self.named('asciinema')
    self.process(function (parent, target, attrs) {
      const parameters = createAsciinemaBlockParameters(target, attrs)
      const result = asciinemaBlock(parameters)
      return self.createPassBlock(parent, result)
    })
  })

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

//demo here: https://jsbin.com/tofehujixe/1/edit?js,output
const chalk = require('chalk');
function spinner() {

  const spinners = {
    fish: {
      interval: 240,
      frames: [`${chalk.blue('>')}${chalk.yellow('))')}'>     `, ` ${chalk.blue('>')}${chalk.yellow('))')}'>    `, `   ${chalk.blue('>')}${chalk.yellow('))')}'>  `, `    ${chalk.blue('>')}${chalk.yellow('))')}'> `, `     ${chalk.blue('>')}${chalk.yellow('))')}'>`, `    <'${chalk.yellow('((')}${chalk.blue('<')} `, `   <'${chalk.yellow('((')}${chalk.blue('<')}  `, `  <'${chalk.yellow('((')}${chalk.blue('<')}   `, `<'${chalk.yellow('((')}${chalk.blue('<')}     `]
    },
    dots: {
      interval: 80,
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
    },
    dots2: {
      interval: 80,
      frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]
    },
    dots3: {
      interval: 80,
      frames: ["⠋", "⠙", "⠚", "⠞", "⠖", "⠦", "⠴", "⠲", "⠳", "⠓"]
    },
    dots4: {
      interval: 80,
      frames: ["⠄", "⠆", "⠇", "⠋", "⠙", "⠸", "⠰", "⠠", "⠰", "⠸", "⠙", "⠋", "⠇", "⠆"]
    },
    dots5: {
      interval: 80,
      frames: ["⠋", "⠙", "⠚", "⠒", "⠂", "⠂", "⠒", "⠲", "⠴", "⠦", "⠖", "⠒", "⠐", "⠐", "⠒", "⠓", "⠋"]
    },
    dots6: {
      interval: 80,
      frames: ["⠁", "⠉", "⠙", "⠚", "⠒", "⠂", "⠂", "⠒", "⠲", "⠴", "⠤", "⠄", "⠄", "⠤", "⠴", "⠲", "⠒", "⠂", "⠂", "⠒", "⠚", "⠙", "⠉", "⠁"]
    },
    dots7: {
      interval: 80,
      frames: ["⠈", "⠉", "⠋", "⠓", "⠒", "⠐", "⠐", "⠒", "⠖", "⠦", "⠤", "⠠", "⠠", "⠤", "⠦", "⠖", "⠒", "⠐", "⠐", "⠒", "⠓", "⠋", "⠉", "⠈"]
    },
    dots8: {
      interval: 80,
      frames: ["⠁", "⠁", "⠉", "⠙", "⠚", "⠒", "⠂", "⠂", "⠒", "⠲", "⠴", "⠤", "⠄", "⠄", "⠤", "⠠", "⠠", "⠤", "⠦", "⠖", "⠒", "⠐", "⠐", "⠒", "⠓", "⠋", "⠉", "⠈", "⠈"]
    },
    dots9: {
      interval: 80,
      frames: ["⢹", "⢺", "⢼", "⣸", "⣇", "⡧", "⡗", "⡏"]
    },
    dots10: {
      interval: 80,
      frames: ["⢄", "⢂", "⢁", "⡁", "⡈", "⡐", "⡠"]
    },
    dots11: {
      interval: 100,
      frames: ["⠁", "⠂", "⠄", "⡀", "⢀", "⠠", "⠐", "⠈"]
    },
    dots12: {
      interval: 80,
      frames: ["⢀⠀", "⡀⠀", "⠄⠀", "⢂⠀", "⡂⠀", "⠅⠀", "⢃⠀", "⡃⠀", "⠍⠀", "⢋⠀", "⡋⠀", "⠍⠁", "⢋⠁", "⡋⠁", "⠍⠉", "⠋⠉", "⠋⠉", "⠉⠙", "⠉⠙", "⠉⠩", "⠈⢙", "⠈⡙", "⢈⠩", "⡀⢙", "⠄⡙", "⢂⠩", "⡂⢘", "⠅⡘", "⢃⠨", "⡃⢐", "⠍⡐", "⢋⠠", "⡋⢀", "⠍⡁", "⢋⠁", "⡋⠁", "⠍⠉", "⠋⠉", "⠋⠉", "⠉⠙", "⠉⠙", "⠉⠩", "⠈⢙", "⠈⡙", "⠈⠩", "⠀⢙", "⠀⡙", "⠀⠩", "⠀⢘", "⠀⡘", "⠀⠨", "⠀⢐", "⠀⡐", "⠀⠠", "⠀⢀", "⠀⡀"]
    },
    line: {
      interval: 130,
      frames: ["-", "\\", "|", "/"]
    },
    line2: {
      interval: 100,
      frames: ["⠂", "-", "–", "—", "–", "-"]
    },
    pipe: {
      interval: 100,
      frames: ["┤", "┘", "┴", "└", "├", "┌", "┬", "┐"]
    },
    simpleDots: {
      interval: 400,
      frames: [".  ", ".. ", "...", "   "]
    },
    simpleDotsScrolling: {
      interval: 200,
      frames: [".  ", ".. ", "...", " ..", "  .", "   "]
    },
    star: {
      interval: 70,
      frames: ["✶", "✸", "✹", "✺", "✹", "✷"]
    },
    star2: {
      interval: 80,
      frames: ["+", "x", "*"]
    },
    flip: {
      interval: 70,
      frames: ["_", "_", "_", "-", "`", "`", "'", "´", "-", "_", "_", "_"]
    },
    hamburger: {
      interval: 100,
      frames: ["☱", "☲", "☴"]
    },
    growVertical: {
      interval: 120,
      frames: ["▁", "▃", "▄", "▅", "▆", "▇", "▆", "▅", "▄", "▃"]
    },
    growHorizontal: {
      interval: 120,
      frames: ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "▊", "▋", "▌", "▍", "▎"]
    },
    balloon: {
      interval: 140,
      frames: [" ", ".", "o", "O", "@", "*", " "]
    },
    balloon2: {
      interval: 120,
      frames: [".", "o", "O", "°", "O", "o", "."]
    },
    noise: {
      interval: 100,
      frames: ["▓", "▒", "░"]
    },
    bounce: {
      interval: 120,
      frames: ["⠁", "⠂", "⠄", "⠂"]
    },
    boxBounce: {
      interval: 120,
      frames: ["▖", "▘", "▝", "▗"]
    },
    boxBounce2: {
      interval: 100,
      frames: ["▌", "▀", "▐", "▄"]
    },
    triangle: {
      interval: 50,
      frames: ["◢", "◣", "◤", "◥"]
    },
    arc: {
      interval: 100,
      frames: ["◜", "◠", "◝", "◞", "◡", "◟"]
    },
    circle: {
      interval: 120,
      frames: ["◡", "⊙", "◠"]
    },
    squareCorners: {
      interval: 180,
      frames: ["◰", "◳", "◲", "◱"]
    },
    circleQuarters: {
      interval: 120,
      frames: ["◴", "◷", "◶", "◵"]
    },
    circleHalves: {
      interval: 50,
      frames: ["◐", "◓", "◑", "◒"]
    },
    squish: {
      interval: 100,
      frames: ["╫", "╪"]
    },
    toggle: {
      interval: 250,
      frames: ["⊶", "⊷"]
    },
    toggle2: {
      interval: 80,
      frames: ["▫", "▪"]
    },
    toggle3: {
      interval: 120,
      frames: ["□", "■"]
    },
    toggle4: {
      interval: 100,
      frames: ["■", "□", "▪", "▫"]
    },
    toggle5: {
      interval: 100,
      frames: ["▮", "▯"]
    },
    toggle6: {
      interval: 300,
      frames: ["ဝ", "၀"]
    },
    toggle7: {
      interval: 80,
      frames: ["⦾", "⦿"]
    },
    toggle8: {
      interval: 100,
      frames: ["◍", "◌"]
    },
    toggle9: {
      interval: 100,
      frames: ["◉", "◎"]
    },
    toggle10: {
      interval: 100,
      frames: ["㊂", "㊀", "㊁"]
    },
    toggle11: {
      interval: 50,
      frames: ["⧇", "⧆"]
    },
    toggle12: {
      interval: 120,
      frames: ["☗", "☖"]
    },
    toggle13: {
      interval: 80,
      frames: ["=", "*", "-"]
    },
    arrow: {
      interval: 100,
      frames: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"]
    },
    arrow2: {
      interval: 80,
      frames: ["⬆️ ", "↗️ ", "➡️ ", "↘️ ", "⬇️ ", "↙️ ", "⬅️ ", "↖️ "]
    },
    arrow3: {
      interval: 120,
      frames: ["▹▹▹▹▹", "▸▹▹▹▹", "▹▸▹▹▹", "▹▹▸▹▹", "▹▹▹▸▹", "▹▹▹▹▸"]
    },
    bouncingBar: {
      interval: 80,
      frames: ["[    ]", "[=   ]", "[==  ]", "[=== ]", "[ ===]", "[  ==]", "[   =]", "[    ]", "[   =]", "[  ==]", "[ ===]", "[====]", "[=== ]", "[==  ]", "[=   ]"]
    },
    bouncingBall: {
      interval: 80,
      frames: ["( ●    )", "(  ●   )", "(   ●  )", "(    ● )", "(     ●)", "(    ● )", "(   ●  )", "(  ●   )", "( ●    )", "(●     )"]
    },
    smiley: {
      interval: 200,
      frames: ["😄 ", "😝 "]
    },
    monkey: {
      interval: 300,
      frames: ["🙈 ", "🙈 ", "🙉 ", "🙊 "]
    },
    hearts: {
      interval: 100,
      frames: ["💛 ", "💙 ", "💜 ", "💚 ", "❤️ "]
    },
    clock: {
      interval: 100,
      frames: ["🕛 ", "🕐 ", "🕑 ", "🕒 ", "🕓 ", "🕔 ", "🕕 ", "🕖 ", "🕗 ", "🕘 ", "🕙 ", "🕚 "]
    },
    earth: {
      interval: 180,
      frames: ["🌍 ", "🌎 ", "🌏 "]
    },
    moon: {
      interval: 80,
      frames: ["🌑 ", "🌒 ", "🌓 ", "🌔 ", "🌕 ", "🌖 ", "🌗 ", "🌘 "]
    },
    runner: {
      interval: 140,
      frames: ["🚶 ", "🏃 "]
    },
    pong: {
      interval: 80,
      frames: ["▐⠂       ▌", "▐⠈       ▌", "▐ ⠂      ▌", "▐ ⠠      ▌", "▐  ⡀     ▌", "▐  ⠠     ▌", "▐   ⠂    ▌", "▐   ⠈    ▌", "▐    ⠂   ▌", "▐    ⠠   ▌", "▐     ⡀  ▌", "▐     ⠠  ▌", "▐      ⠂ ▌", "▐      ⠈ ▌", "▐       ⠂▌", "▐       ⠠▌", "▐       ⡀▌", "▐      ⠠ ▌", "▐      ⠂ ▌", "▐     ⠈  ▌", "▐     ⠂  ▌", "▐    ⠠   ▌", "▐    ⡀   ▌", "▐   ⠠    ▌", "▐   ⠂    ▌", "▐  ⠈     ▌", "▐  ⠂     ▌", "▐ ⠠      ▌", "▐ ⡀      ▌", "▐⠠       ▌"]
    },
    shark: {
      interval: 120,
      frames: ["▐|\\____________▌", "▐_|\\___________▌", "▐__|\\__________▌", "▐___|\\_________▌", "▐____|\\________▌", "▐_____|\\_______▌", "▐______|\\______▌", "▐_______|\\_____▌", "▐________|\\____▌", "▐_________|\\___▌", "▐__________|\\__▌", "▐___________|\\_▌", "▐____________|\\▌", "▐____________/|▌", "▐___________/|_▌", "▐__________/|__▌", "▐_________/|___▌", "▐________/|____▌", "▐_______/|_____▌", "▐______/|______▌", "▐_____/|_______▌", "▐____/|________▌", "▐___/|_________▌", "▐__/|__________▌", "▐_/|___________▌", "▐/|____________▌"]
    },
    dqpb: {
      interval: 100,
      frames: ["d", "q", "p", "b"]
    },
    weather: {
      interval: 100,
      frames: ["☀️ ", "☀️ ", "☀️ ", "🌤 ", "⛅️ ", "🌥 ", "☁️ ", "🌧 ", "🌨 ", "🌧 ", "🌨 ", "🌧 ", "🌨 ", "⛈ ", "🌨 ", "🌧 ", "🌨 ", "☁️ ", "🌥 ", "⛅️ ", "🌤 ", "☀️ ", "☀️ "]
    },
    christmas: {
      interval: 400,
      frames: ["🌲", "🎄"]
    },
    grenade: {
      interval: 80,
      frames: ["،   ", "′   ", " ´ ", " ‾ ", "  ⸌", "  ⸊", "  |", "  ⁎", "  ⁕", " ෴ ", "  ⁓", "   ", "   ", "   "]
    },
    point: {
      interval: 125,
      frames: ["∙∙∙", "●∙∙", "∙●∙", "∙∙●", "∙∙∙"]
    },
    layer: {
      interval: 150,
      frames: ["-", "=", "≡"]
    }
  };
  let spinnerLabel = ''
  let spinnerTheme = 'dots2'

  let {
    frames,
    interval
  } = spinners[spinnerTheme]

  let intervalHnd = null
  let x = 0;
  let t = 0;
  let startTime = Date.now()

  let {
    frames: clockFrames
  } = spinners.clock

  return {
    start: ({theme, label='', iconBefore=false, trackTime=false}) => {
      x = 0
      clearInterval(intervalHnd)
      spinnerLabel = label
      if(theme){
        frames = spinners[theme].frames
        interval = spinners[theme].interval
      }
      
      intervalHnd = setInterval(function () {
        const msg = iconBefore ? `${frames[x++]}${spinnerLabel}` : `${spinnerLabel}${frames[x++]}`
        if(trackTime){
          let now = Date.now()
          process.stdout.write(`\r${clockFrames[t++]}${parseInt((now - startTime)/1000)} ${msg} `);
          t = t % clockFrames.length;
        }else{
          process.stdout.write(`\r${msg} `);
        }
        x = x % frames.length;
      }, interval);
    },
    update: ({label, theme}) => {
      x = 0
      spinnerLabel = label || spinnerLabel
      if(theme){
        frames = spinners[theme].frames
        interval = spinners[theme].interval
      }
    },
    success: (msg = 'done', icon = chalk.green('✔')) => {   
      clearInterval(intervalHnd)   
      process.stdout.write(`\r ${icon} ${msg}                      \n`);
    },
    fail: (msg = 'error') => {      
      clearInterval(intervalHnd)
      process.stdout.write(`\r ${chalk.red('✖')} ${msg}                      \n`);
    },
    stop: (msg) => {
      clearInterval(intervalHnd)

      if(msg){
        process.stdout.write(`\r${msg}                      \n`);
      }else{
        process.stdout.write(`\r                             `);
        process.stdout.write(`\r`);
      }      
    }
  }
}

module.exports = spinner
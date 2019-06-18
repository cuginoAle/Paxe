const fs = require('fs')
const styles = `
  html,
  body {
    padding: 0;
    margin : 0;
    height : 100%;
    color  : rgb(63, 79, 93);
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  }

  .timeStamp {
    font-size: 12px;
    color: grey;
  }

  iframe {
    display : block;
    border  : none;
    position: absolute;
    top     : 0;
    left    : 0;
    width   : 100%;
    height  : 100%;
  }

  main {
    display: flex;
    height : 100%;
  }

  .results {
    flex-grow: 1;
    height   : 100%;
    position : relative;
  }
  nav {
    overflow: auto;
    padding: 0 10px;
  }

  nav ul {
    list-style-type: none;
    margin         : 0;
    padding        : 0;
  }

  .level_Critical{
    color           : yellow;
    background-color: red;
    padding         : 1px 3px;
    border-radius   : 3px;
  }
  .level_Serious{
    color: red
  }
  .level_Moderate{
    color: orange
  }
  .level_Minor{
    color: grey
  }

  .nav_button {
    border    : none;
    padding   : 0.5em;
    font-size : 14px;
    display   : block;
    width     : 100%;
    text-align: left;
    position  : relative;
    cursor    : pointer;
    outline   : none; 
    margin-bottom: 3px;
  }

  .nav_button:hover,
  .nav_button:focus {
    background-color: #d3e2ef;
  }

  .nav_button.active {
    background-color: #3f4f5d;
    color: white;
  }

  .nav_button.active:after {
    content    : "";
    position   : absolute;
    border     : 10px solid transparent;
    border-left: 10px solid #3f4f5d;
    right      : -20px;
    top        : calc(50% - 9px);

  }
`

module.exports = function (results, fileName) {
  const data = results.map(item => {
    const {
      Critical,
      Serious,
      Moderate,
      Minor,
      Page,
      Report
    } = item.summary

    return {
      Critical,
      Serious,
      Moderate,
      Minor,
      Page,
      Report
    }
  })

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>PaXe - global report</title>    
      <style>
        ${styles}
      </style>   
    </head>
    <body>
      <header>        
      </header>
      <main>
        <nav>
          <h1>Global report</h1>
          <p class='timeStamp'>${(new Date()).toLocaleDateString()} - ${(new Date()).toLocaleTimeString()}</p>
          <ul>
            ${data.map((r, i) => (`
              <li>
                <button class="nav_button ${i === 0 ? 'active' : ''}">
                  ${r.Critical ? `<span class='level_Critical'>${r.Critical}</span>` : `<span>-</span>`}
                  ${r.Serious ? `<span class='level_Serious'>${r.Serious}</span>` : `<span>-</span>`}
                  ${r.Moderate ? `<span class='level_Moderate'>${r.Moderate}</span>` : `<span>-</span>`}
                  ${r.Minor ? `<span class='level_Minor'>${r.Minor}</span>` : `<span>-</span>`}

                  ${r.Page.split(' ->')[0]}
                </button>
              </li>
            `)).join('')}
          </ul>
        </nav>
        <div class="results">
          ${data.map((r, index) => {
    const dataSrc = r.Report.split('/').pop()
    return `<iframe style="display:${index === 0 ? 'block' : 'none'}" src="${index === 0 ? dataSrc : ''}" data-src=${dataSrc}></iframe>`
  }).join('')}
        </div>
      </main>
      <footer></footer>
      <script type="text/javascript">
        const nav=document.querySelector("nav")
        var buttons = nav.querySelectorAll("button")
        var iframes = document.querySelectorAll("iframe")

        buttons.forEach((button, index) => button.addEventListener('click',(e) => onClick(e, index)))

        function onClick(e, index){

          buttons.forEach((button, i)=>{
            const isSelected = index === i
            button.classList.toggle('active', isSelected)
          })

          iframes.forEach((frame, i) => {
            const isSelected = index === i
            // lazy-loading the iframes content
            if(isSelected && frame.dataset.src !== "") {
              frame.src = frame.dataset.src
              frame.dataset.src = ""
            }
            frame.style="display:" + (isSelected ? 'block':'none')
          })
          
        }

      </script>         
    </body>
  </html>
  `
  fs.writeFileSync(fileName, html)
}

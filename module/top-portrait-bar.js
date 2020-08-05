export class TopPortraitBar {


  static async render(actor) {
    let portraitBar = $('#portrait-bar')
    if (portraitBar.length === 0) {
      var $portraitBarDiv = $( "<div id='portrait-bar' class='portrait-bar flexrow'></div>" )
      $('#navigation').append($portraitBarDiv)
    }
    portraitBar = $('#portrait-bar')
    console.log('Bar', portraitBar, actor)
    if (actor == null)
      return;
    if (actor.data.type !== "character")
      return;
    if (!actor.hasPerm(game.user, "OBSERVER")) // Player cannot see
      return;

    if (portraitBar.find('#actor-portrait-'+actor.id).length === 0) {
      var $portraitDiv = $( "<div id='actor-portrait-"+actor.id+"' class='portrait'><div class='buffbox flexrow'></div><img src='"+actor.img+"'><div class='damage'></div><span class='life'>10/10</span></div>" )
      portraitBar.append($portraitDiv)
    }

    let portraitDiv = portraitBar.find('#actor-portrait-'+actor.id);
    let buffBar = portraitDiv.find('.buffbox');
    buffBar.empty()
    // let quickActions = '<div class="col actions"><div class="above">'
    let items = actor.data.items.filter(o => (o.type === "buff") && getProperty(o, "data.active") === true).sort((a, b) => {      return a.data.sort - b.data.sort;
    });
    let damage = portraitDiv.find('.damage');
    let life = portraitDiv.find('.life');
    let pixelDamage = 100 - (actor.data.data.attributes.hp.value / actor.data.data.attributes.hp.max) * 100
    if (actor.data.data.attributes.hp.value === 0) {
      pixelDamage = 0;
      portraitDiv.addClass('dead');
      life.text(`Dead`)
    } else {
      portraitDiv.removeClass('dead');
      life.text(`${actor.data.data.attributes.hp.value} / ${actor.data.data.attributes.hp.max}`)
    }
    damage.css("height",`${pixelDamage}px`)
    damage.css("top",`calc(100px - ${pixelDamage}px)`)
    //<div class="item-image tooltip" style="background-image: url('systems/D35E/icons/buffs/bark-skin.png')">
    //              <span class="tooltipcontent">
    //                   Barkskin
    //                 </span>
    //             </div>
    let buffBarItems = "";
    items.forEach(function(item) {
      const icon = item.img;
      let title = item.name;
      const type = item.type;
      buffBarItems += `<div class="item-image tooltip" style="background-image: url('${item.img}')"></div>`;
    });

    buffBar.append(buffBarItems);


    //html.find('.col.middle').after(quickActions + '</div></div>');

    portraitDiv.click(function(event) {
      if (!actor.hasPerm(game.user, "OBSERVER")) // Player cannot see
        return;
      actor.sheet.render(true);
    });
  }
}

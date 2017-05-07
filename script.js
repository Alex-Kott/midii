$.fn.calc = function(param) {

  var $selector = this;

  var content = '<div class="calc">';
  var totalCost = 0;

  for(var i in param.products){
    content += '<div class="col'+(Number(i)+1)+' cols">';
    var product = param.products[i];
    content += '<h5>'+product.productTitle+'</h5>';
    content += '<table><tbody>';
    var groups = product.groups;
    for(var j in groups){
      var group = groups[j];
      content += '<tr><td colspan="4" class="subhead">'+group.groupTitle+'</td></tr>';
      for(var k in group.types){
        var type = group.types[k];
        content += `
        <tr class="position">
          <td class="prodname">
            <strong>`+type.itemTitle+`</strong>
            <div class="cmnt">`+type.description+`</div>
          </td>
          <td>
            <span class="wpcf7-form-control-wrap pos`+(Number(i)+1)+`">
              <input type="number" name="`+type.itemTitle+`" value="" class="wpcf7-form-control wpcf7-number wpcf7-validates-as-number amnt" min="0" max="9999" step="1" aria-invalid="false" placeholder="`+product.unit+`">
            </span>
          </td>
          <td class="cost">`+type.cost+`.- /`+product.unit+`</td>
          <td class="price">0.–</td>
        </tr>
        `
      }
    }
    content += '</tbody></table>';
    content += '</div>';
  }

  content += "</div>";

  $('.calc').replaceWith(content);
  $('.calc-container').html(content);


  var comment_area = `
    <p>
      <span class="wpcf7-form-control-wrap comments">
        <textarea name="comments" cols="40" rows="10" class="wpcf7-form-control wpcf7-textarea" aria-invalid="false" placeholder="Комментарии"></textarea>
      </span>
    </p>
    <table>
      <tbody>
        <tr>
          <td>
            <h5>Итого: <span class="price total-cost">0.–</span></h5>
          </td>
          <td>
            <input type="button" value="Подтвердить" class="submit-button">
            <input style="display: none;" type="submit" value="Подтвердить" class="wpcf7-form-control wpcf7-submit ">
            <span class="ajax-loader"></span>
          </td>
        </tr>
       </tbody>
    </table>
  `;

  
  function comment(){
    $('.col2').append(comment_area);
  }
  setTimeout(comment, 0);

};

$("body").on("input", "input[type=number]", function(){
  var total_cost = 0;
  $(".position").each(function(){
    var amount = $(this).find("input").val();
    var cost = $(this).find(".cost").text().match(/^\d*/)
    $(this).find('.price').text(Number(amount*cost)+'.-')
    total_cost += amount*cost;
  })

  $('.total-cost').text(total_cost+'.-');
});

function reset_forms(){
  $('.calc-container').calc(goods);
}

$('body').on("submit", "form", function(e){
  e.preventDefault();
  submit_form(e);
});
$('body').on("click", ".submit-button", function(e){
  e.preventDefault();
  submit_form(e);
});


function submit_form(e){
  var flag = true;
  var cols = $(".cols");
  for(var n = 0; n < cols.length; n++){
    var amount = Number(0);
    $(cols[n]).find(".position").each(function(){
      amount += Number($(this).find("input").val());
    });

    product = goods.products[n];

    if((Number(amount) < product.minamount) && (Number(amount) > 0)){
      alert(product.productTitle+" должны быть в количестве не менее "+product.minamount+" "+product.unit);
      flag = false;
    } 

  }

  if(!flag){
      e.preventDefault();
      return false; 
    } else {
      $("input[type=submit]").trigger("click");
      setTimeout(reset_forms, 500);
      amount = 0;
    }
}

var goods = {
  products: [{
      productTitle: 'Устрицы',
      minamount: 250,
      unit: "шт",
      groups: [{
          groupTitle: 'Черноморская',
          types: [{
              itemTitle: 'Престиж',
              cost: '120',
              description: 'от 120г'
            },
            {
              itemTitle: 'Стандарт',
              cost: '200',
              description: 'от 120г'
            },
            {
              itemTitle: 'Элегант',
              cost: '300',
              description: 'от 120г'
            }
          ]
        },
        {
          groupTitle: 'Дальневосточная',
          types: [{
            itemTitle: 'Стандарт',
            cost: '120',
            description: 'от 120г'
          }]
        }
      ]
    },
    {
      productTitle: 'Мидии',
      minamount: 30,
      unit: 'кг',
      groups: [{
        groupTitle: 'Стандартная',
        types: [{
          itemTitle: 'Стандартная',
          cost: '120',
          description: 'от 120г'
        }]
      }]
    }
  ]
};

$('.calc-container').calc(goods);
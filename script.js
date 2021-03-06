$.fn.calc = function(param) {

  var $selector = this;

  var content = `<div class="calc">
  <div class="col1 cols"></div>
  <div class="col2 cols"></div>
  `;

  $('.calc').replaceWith(content);
  $('.calc-container').html(content);

  content = '';
  var totalCost = 0;
  var pos = 1;
  for(var i in param.products){
    var product = param.products[i];
    content += '<h5>'+product.productTitle+'</h5>';
    content += '<table data-product="'+product.productTitle+'"><tbody>';
    var groups = product.groups;
    for(var j in groups){
      var group = groups[j];
      content += '<tr><td colspan="4" class="subhead">'+group.groupTitle+'</td></tr>';
      for(var k in group.types){
        var type = group.types[k];
        content += `
        <tr class="position" data-minamount='`+product.minamount+`''>
          <td class="prodname">
            <strong>`+type.itemTitle+`</strong>
            <div class="cmnt">`+type.description+`</div>
          </td>
          <td>
            <span class="wpcf7-form-control-wrap pos`+(Number(i)+1)+`">
              <input type="hidden" name="form[pos`+(pos++)+`]" value="" data-product='`+product.productTitle+`' data-group='`+group.groupTitle+`' data-type='`+type.itemTitle+`' data-unit='`+product.unit+`' class="hidden">
              <input type="number"  value="" class="wpcf7-form-control wpcf7-number wpcf7-validates-as-number amnt amount" min="0" max="9999" step="1" aria-invalid="false" placeholder="`+product.unit+`">
            </span>
          </td>
          <td class="cost">`+ranks(type.cost)+`.- /`+product.unit+`</td>
          <td class="price">0.–</td>
        </tr>
        `
      }
    }
    content += '</tbody></table>';
    col = product.column;
    $(".col"+col).append(content);
    content = '';
  }



  var comment_area = `
    <p>
      <span class="wpcf7-form-control-wrap comments">
        <textarea style="display: none" class="orders" name="orders" ></textarea>
        <textarea name="comments" cols="40" rows="10" class="wpcf7-form-control wpcf7-textarea" aria-invalid="false" placeholder="Комментарии"></textarea>
      </span>
    </p>
    <table>
      <tbody>
        <tr>
          <td>
            <h5>Итого: <span class="price total-cost">0.–</span></h5>
            <input type="hidden" name="total">
          </td>
          <td>
            <input type="button" value="Подтвердить" class="submit-button">
            <input style="display: none !important;" type="submit" value="Подтвердить" class="wpcf7-form-control wpcf7-submit send-order">
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
    var amount = $(this).find(".amount").val();
    var cost = $(this).find(".cost").text().match(/^\d*/)
    var product = $(this).find(".hidden").data('product');
    var group = $(this).find(".hidden").data('group');
    var type = $(this).find(".hidden").data('type');
    var unit = $(this).find(".hidden").data('unit');

    if(amount != ''){
      var value = (new Array(product, group, type, amount+' '+unit, ranks(Number(amount*cost))+' руб')).join(" - ");
      $(this).find(".hidden").val(value);
    }
    
    $(this).find('.price').text(ranks(Number(amount*cost))+'.-')
    total_cost += amount*cost;
  })

  $("input[name=total]").val(ranks(total_cost));
  $('.total-cost').text(ranks(total_cost)+'.-');
});

function reset_forms(){
  $('.calc-container').calc(goods);
}

$('body').on("click", ".submit-button", function(e){
  submit_form(e);
});


function submit_form(e){
  var flag = true;
  var empty = true;
  var products = $("table[data-product]");
  for(var n = 0; n < products.length; n++){
    var amount = Number(0);
    var minamount;
    $(products[n]).find(".position").each(function(){
      minamount = $(this).data("minamount");
      console.log(minamount)
      amount += Number($(this).find("input[type=number]").val());

      var value = $(this).find(".hidden").val();
      var buffer = $(".orders").html();
      $(".orders").html(buffer+'\n'+value)
    });

    product = goods.products[n];

    if((Number(amount) < minamount) && (Number(amount) > 0)){
      alert(product.productTitle+" должны быть в количестве не менее "+minamount+" "+product.unit);
      flag = false;
    }
    if(Number(amount) != 0) empty = false;

  }

  if(empty){
    alert("Вы ничего не заказали");
    return false;
  }

  if(!flag){
      return false; 
    } else {
      $(".send-order").trigger("click");
      setTimeout(reset_forms, 500);
      amount = 0;
    }
}


var goods = {
  products: [
     {productTitle: 'Устрицы',
      minamount: 250,
      unit: "шт",
      column: 1,
      groups: [{
          groupTitle: 'Черноморская (Французская)', types: [

            {itemTitle: 'Престиж (2)',
             cost: '160',
             description: 'от 100 г'},

            {itemTitle: 'Стандарт (3)',
             cost: '130',
             description: '75 – 100 г'},

            {itemTitle: 'Элегант (4)',
             cost: '100',
             description: '60 – 75 г'}
           ]
        },
        {
          groupTitle: 'Черноморская (Дальневосточная)',
          types: [
           {itemTitle: '',
            cost: '100',
            description: ''}
           ]
        }
      ]
    },
{
      productTitle: 'Креветки',
      minamount: 100,
      unit: "тонн",
      column: 1,
      groups: [{
          groupTitle: 'Креведка!',
          types: [{
              itemTitle: 'Тигровая',
              cost: '160',
              description: 'от 100 г'
            }
          ]
        }
      ]
    },
    {
      productTitle: 'Мидии',
      minamount: 30,
      unit: 'кг',
      column: 2,
      groups: [{
        groupTitle: '',
        types: [{
          itemTitle: '',
          cost: '160',
          description: 'от 30 кг'
        }]
      }]
    }
  ]
};

$('.calc-container').calc(goods);

function ranks(n){
  str = String(n);
  return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
}

/*
document.addEventListener( 'wpcf7invalid', function( event ) {
    alert( "Извините. Ваш запрос не может быть отправлен. Проверьте полноту и корректность заполнения полей формы" );
}, false );
*/
$(document).ready(function() {
  const resCards = $(".resource-card");
  const resIds = {};

  for (let i = 0; i < resCards.length; i++){
    resIds[i] = resCards[i].dataset.resource_id;
  }

  /* TODO GET LIKE COUNT
  $.get('/api/v1/likes/resources', resIds, function(likes){
    for (let like of likes){
      const resCard = $(`[data-resource_id="${rating.resource_id}"]`);
    }
  })*/

  $.get('/api/v1/categories/', resIds, function(categories){
    for (let cat of categories){
      $('#categoriesMenu').append(
        `<li><a href="/categories/${cat.category_id}/resources">${cat.category}</a></li>`
      );
    }
  });

  $.get('/api/v1/likes/resources/user', resIds, function(likes){
    for (let like of likes){
      const likeAnchor = $(`[data-res_id="${like.resource_id}"]`);
      likeAnchor.children('i').toggleClass('far');
      likeAnchor.children('i').addClass('fas');
    }
  });

  $.get('/api/v1/ratings/resources/user', resIds, function(ratings){
    for (let rating of ratings){
      const resCard = $(`[data-resource_id="${rating.resource_id}"]`);
      const rate = rating.rating;
      const stars = resCard.find('.rating label').toArray().reverse();
      $(stars[rate - 1]).addClass('selected');
    }
  })

  $('#primary-menu').on(
  'show.zf.dropdownmenu', function() {
    var dropdown = $(this).find('.is-dropdown-submenu');
    dropdown.css('display', 'none');
    dropdown.fadeIn('slow');
  });

  $('#primary-menu').on(
    'hide.zf.dropdownmenu', function() {
      var dropdown = $(this).find('.is-dropdown-submenu');
      dropdown.css('display', 'inherit');
      dropdown.fadeOut('slow');
  });

  $('.has-submenu .menu li').hover(
    function(){
      $(this).css('background-color', '#bababa');
    },
    function(){
      $(this).css('background-color', '#e6e6e6');
    }
)

  $('.like-button').on('click', function(ev) {
      const loggedInUserId = 1;
      let data = {
        resourceid: ev.delegateTarget.dataset.res_id,
        userid: loggedInUserId
        // userid: 1
      };

      $.post(`/resources/${data.resourceid}/likes`, data);
      $(ev.delegateTarget).children('i').toggleClass('far');
      $(ev.delegateTarget).children('i').toggleClass('fas');
  });


  $('.rating input').on('click', function(){
    const parentCard = $(this).parents('div .resource-card');
    const resId = parentCard[0].dataset.resource_id;
    const rating = $(this).val();
    $(this).parent().siblings().removeClass('selected');
    $(this).parent().addClass('selected');
    $.post(`/resources/${resId}/rating`, {resourceId: resId, rating: rating});
  });

  $('.fa-tags').on('click', function(){
    console.log('sup');
    const dialog = $(this).parents('.resource-card').find('.hiddenDiv').dialog({
      autoOpen: false,
      height: 300,
      width: 400,
      modal: true,
    });
    dialog.dialog( "open" );
  });

})

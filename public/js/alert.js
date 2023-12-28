const hideAlert = function () {
  const el = document.querySelector('.alert');
  el?.parentElement.removeChild(el);
};

export const showAlert = function (type, msg) {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(hideAlert, 5000);
};

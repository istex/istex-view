import $ from 'jquery';

var IVConfigModel = function () {
  const self = this;

  self.data = {};
  self.initializing = true;
  self.ajaxLoading = false;
  self.onChanges = [];

  // request the istex-view config
  $.get('/config.json').done(function (config) {
    self.data = config;
    self.initializing = false;
    self.inform();
  });

  // // simulate ajax request
  // setTimeout(function () {
  //   self.data = {
  //     istexApiUrl: "https://api.istex.fr",
  //   };
  //   self.initializing = false;
  //   self.inform();
  // }, Math.round(Math.random() * 1000));

};

IVConfigModel.prototype.subscribe = function (onChange) {
  this.onChanges.push(onChange);
};

IVConfigModel.prototype.inform = function () {
  this.onChanges.forEach(function (cb) { cb(); });
};

export default IVConfigModel;
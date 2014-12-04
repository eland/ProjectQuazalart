function User(data) {
  this.name = data.name || '';
  this.hand = data.hand || [];
  this.score = data.score || 0;
  this.isCzar = data.isCzar || false;
}

module.exports = User;
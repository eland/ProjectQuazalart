function User(data) {
  this.name = data.name || '';
  this.hand = data.hand || [];
  this.score = data.score || 0;
}

module.exports = User;
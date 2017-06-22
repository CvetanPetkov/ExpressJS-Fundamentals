module.exports = {
  hyperlinksChecker: (msg) => {
    if (msg.message.trim().startsWith('http')
      && (msg.message.trim().endsWith('jpg') || msg.message.trim().endsWith('jpeg') || msg.message.trim().endsWith('jpg'))) {
      return 'isImage'
    } else if (msg.message.trim().startsWith('http')) {
      return 'isHyperLink'
    }
  },
  checkBlockedUser: (userId) => {

  }
}

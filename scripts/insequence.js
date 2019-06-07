function inSequence (tasks) {
  return tasks.reduce((p, task) => p.then(task), Promise.resolve())
}
module.exports = inSequence

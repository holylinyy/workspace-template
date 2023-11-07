/* eslint-disable @typescript-eslint/no-var-requires */
const wrap = require('word-wrap')
var longest = require('longest')
var chalk = require('chalk')
const { map } = require('lodash')
var filter = function (array) {
  return array.filter(function (x) {
    return x
  })
}

var headerLength = function (answers) {
  return (
    answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0)
  )
}

var maxSummaryLength = function (options, answers) {
  return options.maxHeaderWidth - headerLength(answers)
}

var filterSubject = function (subject, disableSubjectLowerCase) {
  subject = subject.trim()
  if (
    !disableSubjectLowerCase &&
    subject.charAt(0).toLowerCase() !== subject.charAt(0)
  ) {
    subject = subject.charAt(0).toLowerCase() + subject.slice(1, subject.length)
  }
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1)
  }
  return subject
}

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function (options) {
  var types = options.types
  var length = longest(Object.keys(types)).length + 1
  var choices = map(types, function (type, key) {
    return {
      name: (key + ':').padEnd(length) + ' ' + type.description,
      value: key,
    }
  })

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function (cz, commit) {
      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: '选择您要提交的更改类型:',
          choices: choices,
          default: options.defaultType,
        },
        {
          type: 'input',
          name: 'subject',
          message: function (answers) {
            return (
              '写一个简短的修改描述 (最多 ' +
              maxSummaryLength(options, answers) +
              ' 个字符):\n'
            )
          },
          default: options.defaultSubject,
          validate: function (subject, answers) {
            var filteredSubject = filterSubject(
              subject,
              options.disableSubjectLowerCase,
            )
            return filteredSubject.length == 0
              ? '缺少修改描述'
              : filteredSubject.length <= maxSummaryLength(options, answers)
              ? true
              : '描述内容的长度必须小于或等于 ' +
                maxSummaryLength(options, answers) +
                ' 个字符. 当前长度为 ' +
                filteredSubject.length +
                ' 个字符.'
          },
          transformer: function (subject, answers) {
            var filteredSubject = filterSubject(
              subject,
              options.disableSubjectLowerCase,
            )
            var color =
              filteredSubject.length <= maxSummaryLength(options, answers)
                ? chalk.green
                : chalk.red
            return color('(' + filteredSubject.length + ') ' + subject)
          },
          filter: function (subject) {
            return filterSubject(subject, options.disableSubjectLowerCase)
          },
        },
        {
          type: 'input',
          name: 'body',
          message: '可以提供一个更长的修改描述:(按enter键跳过)\n',
          default: options.defaultBody,
        },
        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: '这个变化有相关的ones单吗?',
          default: options.defaultIssues ? true : false,
        },
        {
          type: 'input',
          name: 'issues',
          message: '添加一个已经存在的ones单 (e.g. "fix #123", "re #123".):\n',
          when: function (answers) {
            return answers.isIssueAffected
          },
          default: options.defaultIssues ? options.defaultIssues : undefined,
        },
      ]).then(function (answers) {
        var wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth,
        }

        // parentheses are only needed when a scope is present
        // var scope = answers.scope ? '(' + answers.scope + ')' : ''

        // Hard limit this line in the validate
        var head = answers.type + ': ' + answers.subject

        // Wrap these lines at options.maxLing,eWidth characters
        var body = answers.body ? wrap(answers.body, wrapOptions) : false

        var issues = answers.issues ? wrap(answers.issues, wrapOptions) : false

        commit(filter([head, body, issues]).join('\n\n'))
      })
    },
  }
}

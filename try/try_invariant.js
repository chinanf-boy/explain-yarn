var invariant = require('invariant');

invariant(true, 'This will not throw');
// No errors

invariant(false, 'This will throw an error with this message');
// Error: Invariant Violation: This will throw an error with this message

// 注意：当 process.env.NODE_ENV不是  `production` 时，

// 该消息是必需的。 如果省略，则无论条件的真实性如何，不变将抛出。 

// 当process.env.NODE_ENV 是 production 时，消息是可选的 - 所以它们可以被缩小。
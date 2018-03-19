# HAPI v17

The new major version of Hapi fully embraces the `async/await` feature brought in **ES2017 (ES8)**. This totally changes the way we interact with the framework and one should be comfortable with it to use this new version of Hapi.

## Disclaimer

This *tutorial* is not meant to be exhaustive but rather hightlights the main changes that concerns us and then links to some additional resources that might help you deepen your knowledge.

## Introduction to async/await

Async/await relies on the use of `Promise`. It is a new way of dealing with asynchronous operation and it makes them looks like synchronous operations.

For the curious one, behind the scene async/await uses [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

### Async keyword

The first part of this workflow is the `async` keyword. It is used to indicate that asynchronous operations are performed within a function. It works with all kind of function:

* anonymous function
* arrow function
* function expression
* function declaration

Here is how it looks like:
```js
async function myAsyncFunction() {}
```

When an `async` function is called it returns a promise that can be either resolved or rejected depending on what's going on in the function. Any error thrown inside the function will result in the promise to be rejected whereas when no error occurs the promise will be resolved.

You don't have to return a promise yourself when you want to return a value in your `async` function because it wraps the value you return inside a promise aka the resolved promise value will be what you returned.

```js
// both version are equals
async function notNeeded() { return Promise.resolve(4); }
async function betterVersion() { return 4; }
```

### Await keyword

This keyword can only be used inside an `async` function which means that sometimes you'd have to do that:
```js
(async function() {
  const myValue = await asynchronousOperation();
})();
```

The above is called an IIFE which stands for **immediately invoked function expression**.

`await` will pause the execution of your `async` function until the promise it waits will either resolve or reject. If the promise resolves you get back the resolve value of that promise. If it rejects, an exception will be raised with the reason. Then it resumes the function execution and continues if there are other operations to perform. Considering error handling when calling a asynchronous function with `await`, you have to surround it with `try/catch` block such as:
```js
async function myErrorHandling() {
  let value = null;

  try {
    value = await asyncOp();
  } catch (error) {
    logService(error);
  }

  return value;
}
```

If you don't catch the error, it will bubble up the function call stack until it reaches the main scope which will cause the running process to crash like a sync error would do.

**Side notes**: you can await any object that have a `.then` property. You can use await on any function returning a promise even if it is not declared as `async`.

### Async/await gotchas

#### 1) sequence vs parallel execution
When dealing with multiple promises, don't await every one of them because you'll be slowing yourself down. Instead use `Promise.all` to get a promise for all of them and just `await` that promise. Here is a snippet showcasting this common error:
```js
async function sequence() {
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('first timeout');
      resolve();
    }, 2000);
  });
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('second timeout');
      resolve();
    }, 2000);
  });
}

async function parallel() {
  const p1 = new Promise(resolve => {
    setTimeout(() => {
      console.log('first timeout');
      resolve();
    }, 2000);
  });

  const p2 = new Promise(resolve => {
    setTimeout(() => {
      console.log('second timeout');
      resolve();
    }, 2000);
  });

  await Promise.all([p1, p2]);
}

// will wait 2s display 'first timeout', wait 2s again and then display 'second timeout' => total wait 4s
sequence();

// will wait 2s then display first timeout and second timeout at the same time (pretty much) => total wait 2s
parallel();
```

As I said before, `await` will pause the execute of the async function until the promise it waits is settled.

#### 2) Errors mixup

When using `async/await` errors get mixup between system error and business logic error. For example if a call to an `fs` function throws an error it would get caught by your `try/catch` the same way as would a `throw Boom.notFound()` hence you need a way to differentiate them. That's where `Bounce` comes into play. This is a library introduced by Hapi's creator: Eran Hammer. Taken from `Bounce` github README:

> Working with async/await introduces a new challenge in handling errors. Unlike callbacks, which provide a dual mechanism for passing application errors via the callback err argument and developer errors via exceptions, await combines these two channels into one.
>
> It is common practice to ignore application errors in background processing or when there is no useful fallback. In those cases, it is still imperative to allow developer errors to surface and not get swallowed.

[Source](https://github.com/hapijs/bounce#introduction)

No need for me to repeat what is already well described over there so just have a look and read it.

Here you go, you know the bare minimum required to use `async/await` in your code right now! Now go write some awesome code!

## Hapi@17 difference

This section will not go into details about all the differences between the 16 and 17 version but rather compile what we used in our project and what changed about it. If you want a more detailed explanation head over [here](https://github.com/hapijs/hapi/issues/3658) and the [API documentation](https://hapijs.com/api).

### Plugins

#### Create a plugin

The way you create plugin has changed now. You don't export a function with properties anymore but an object:
```js
// before
module.exports = function register(server, options, next) {
  ...

  next();
}

module.exports.attributes = { name: 'myPlugin', version: '1.0.0' };

// now
module.exports = {
  name: 'myPlugin',
  version: '1.0.0',
  async register(server, options) {
    // async operation
  },
};
```

Taken from [Hapi tutorial](https://hapijs.com/tutorials/plugins?lang=en_US):

> As we've seen above, the `register` method accepts two parameters, server and options.
>
>The options parameter is simply whatever options the user passes to your plugin when calling server.register(plugin, options). No changes are made and the object is passed directly to your register method.
>
> `register` should be an async function that returns once your plugin has completed whatever steps are necessary for it to be registered. Alternatively your register plugin should throw an error if an error occurred while registering your plugin.
>
>The `server` object is a reference to the server your plugin is being loaded in.

#### Registering a plugin

Loading a plugin is still done through the method `server.register`. You can register one or more plugins. The call to the method should be awaited so you make sure your plugin are loaded before doing action that could require the presence of such plugins. [Here](https://hapijs.com/tutorials/plugins#loading-a-plugin) are examples of the different ways you could load a plugin and how to pass options to them.

### Routes

#### Adding a route

Routes are still added through `server.route` method. The route object still have `method`, `path` and `handler` properties. However the `config` properties has been removed and is now [`options`](https://hapijs.com/api#route-options). The handler has changed also:
```js
server.route({
  method: 'GET',
  path: '/test',
  async handler(request, h) {
    return 'hello';
  },
});
```

Your handlers don't receive the `reply` interface anymore. Instead you get a response toolkit. Taken from [hapi's tutorial](https://hapijs.com/tutorials/routing?lang=en_US):
> The second parameter, h, is the response toolkit, an object with several methods used to respond to the request. As you've seen in the previous examples, if you wish to respond to a request with some value, you simply return it from the handler. The payload may be a string, a buffer, a JSON serializable object, a stream or a promise.
>
> Alternatively you may pass the same value to `h.response(value)` and return that from the handler. The result of this call is a response object, that can be chained with additional methods to alter the response before it is sent. For example `h.response('created').code(201)` will send a payload of created with an HTTP status code of 201. You may also set headers, content type, content length, send a redirection response, and many other things that are documented in the [API reference](https://hapijs.com/api#response-toolkit).

#### Serving static content

Before going into details here, you have to make sure the `inert` plugin is loaded into your server. There are several ways to serve static content:

1) Return `h.file(path)` from your handler.
2) Using a file handler:
```js
server.route({
  method: 'GET',
  path: '/test-file',
  handler: { file: 'pathToFile.png' },
});
```
3) Using a file handler with `file` function property with request params:
```js
server.route({
  method: 'GET',
  path: '/{filename}',
  handler: {
    file(request) {
      return request.params.filename;
    },
  },
});
```

There are other possibilities so have a look at [Hapi's official tutorial](https://hapijs.com/tutorials/serving-files?lang=en_US).

#### Access database instance

You can still access the database instance through the request object of your handler like you used to when using `hapi-sequelizejs`:
```js
function handler(request, h) {
  const db = request.getDb();
  // do awesome stuff
}
```

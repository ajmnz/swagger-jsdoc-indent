# swagger-jsdoc-indent

Write indentable OpenApi/Swagger jsDoc comments.

### Description

This VSCode extension targets [this](https://stackoverflow.com/questions/58186804/vscode-indent-in-swagger-jsdoc) issue on StackOverflow. Basically,
when writing your API spec in YAML with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc/), it is impossible to get automatic indentation and formatting
inside the comment blocks. Thus, you end up either writing it in JSON or manually adding spaces/tabs for each line, which is _really tedious_.

The extension allows you to write your spec inside comment blocks and then format it so [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc/) can parse it
and generate your spec.

> VSCode enables automatic indentation when there's no preceding asterisk (`*`).

```ts
/**
 * You won't be able to get automatic indentation here
 * or here
 * 
but you'll
  get it here,
  when there's no asterisk
    preceding the line
 */
```

### Usage

##### Installation

Install the extension from the [installation page](https://marketplace.visualstudio.com/items?itemName=ajmnz.swagger-jsdoc-indent).

##### Writing comment blocks

For the extension to correctly parse your comment block, it should follow the following guidelines:

- The spec has to start with either `@swagger` or `@openapi`
- It should be aligned/indented with the `/**`
- No line (of the spec) should start with an asterisk (`*`)
- It can contain regular comments preceded by an asterisk before and after the spec
- **Before running the extension you must select the comment block**

##### Example

Write your spec

```ts
/**
 * Spec for the route /auth/register.
 *
@openapi
/auth/register:
  post:
    summary: Register as user
    tags:
      - Auth
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - name
              - email
              - password
            properties:
              name:
                type: string
              email:
                type: string
                format: email
                description: Must be unique
              password:
                type: string
                format: password
                minLength: 8
                description: At least one number and one letter
 * 
 * More regular comments here
 */
```

Select your comment block, press `cmd + shift + P` (MacOS) or `ctrl + shift + P` (Windows) and search for `Format swagger-jsdoc comment`.

The extension will:

- Run [prettier](https://prettier.io/) to fix/catch indentation errors
- Add an asterisk at the start of each line
- Replace your comment block with the formatted one
- Respect any indentation of your block

```ts
/**
 * Spec for the route /auth/register.
 *
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *
 *
 * More regular comments here
 */
```

Optionally run [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc/) to generate your spec.

```sh
$ yarn swagger-jsdoc -d docs/api/definition.yml src/api/routes/v1/**.ts -o docs/api/specification.yml
```

# License

MIT

#@MediaJS
A library for sharing semantic naming of breakpoints between CSS compilers such as SASS or LESS.

##Usage
```javascript
var at = new atMedia.create({
        element:document.querySelector('[breakpoints]')
    }),
    subscriber = at.onChange(function(breakpoint){
        element.innerHTML = breakpoint;
    });
```

##API
| Name        | Type        | Description           | Example  |
| ------------- | ------------- | ------------- | ----- |
| current | string | Represents the current breakpoint active in the viewport |  |
| closestInRange      | Function      | Returns the breakpoint to match the current breakpoint in a range |  |
| currentLargerThan      | Function     | Returns true/false if the current breakpoint is larger the value supplied     |    |
| onChange      | Function     | Accepts a Function to be executed on breakpoint change    |    |
| remove      | Function     | Removes eventListeners and subscriptions from the class     |    |

##License
See [LICENSE](https://github.com/stewil/atMediaJS/blob/master/LICENSE.txt).
# fswitch 

_**The cleaner, functional switch.**_

## Usage

Here are some comparisons of doing the same thing with vanilla JavaScript and with `fswitch`.

### Returning values

```javascript
// fswitch
import $switch from 'fswitch'

const monthToString = (month) => $switch(month)
  .when(0, () => 'January')
  .when(1, () => 'February')
  // ...
  .default(() => 'December')
  .match()

// Vanilla JavaScript
const monthToString = (month) => {
  switch (month) {
    case 0:
      return 'January'
      break

    case 1:
      return 'February'
      break

    // ...

    default:
      return 'December'
  }
}
```

### Producing side effects

Sometimes you just want to switch over a value and handle a couple different cases without
returning a value in the end. All you need to do that is omit the `.match()` at the end.

```typescript
// fswitch
import $switch from 'fswitch'

// Handling a Vuex store subscription
$store.subscribe((mutation, state) => $switch([mutation.type, state.user.id !== -1])
  .when([['SET_USER', true], ['LOAD_USER', true]], () => {
    $router.push({ name: 'Home' })
  })
  .when([['SET_USER', false], ['LOGOUT', false]], () => {
    $router.push({ name: 'Login' })
  }))

// Vanilla JavaScript
const handleUpdate = ({ type, state: { user: id } }) => {
  switch (type) {
    case 'SET_USER':
      $router.push({ name: id !== -1 ? 'Home' : 'Login' })
      break

    case 'LOAD_USER_FROM_STORAGE':
      if (id !== -1) $router.push({ name: 'Home' })
      break

    case 'LOGOUT':
      $router.push({ name: 'Login' })
      break
  }
}
```
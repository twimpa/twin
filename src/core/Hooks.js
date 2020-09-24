// From https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/
// Example 4

export const Hooks = (function () {
  let hooks = [];  // Array of hooks
  let currentHook = 0; // An iterator!
  return {
    render(Component) {
      const Comp = Component(); // Run effects
      Comp.render();
      currentHook = 0; // Reset for next render
      return Comp;
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray;
      const deps = hooks[currentHook]; // Type: array | undefined
      const hasChangedDeps = deps ? !depArray.every((el, i) => el === deps[i]) : true;
      if (hasNoDeps || hasChangedDeps) {
        callback();
        hooks[currentHook] = depArray;
      }
      currentHook++; // Done with this hook
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue; // type: any
      const setStateHookIndex = currentHook; // for setState's closure!
      const setState = newState => (hooks[setStateHookIndex] = newState);
      return [hooks[currentHook++], setState];
    }
  }
})();

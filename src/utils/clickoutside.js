const clickoutsideContext = '@@clickoutsideContext';

export default {
  /*
   @param el 指令所绑定的元素
   @param binding {Object}
   @param vnode vue编译生成的虚拟节点
   */
  bind(el, binding, vnode) {
    const documentHandler = e => {
      if (!vnode.context || el.contains(e.target)) {
        return;
      }
      if (binding.expression) {
        vnode.context[el[clickoutsideContext].methodName](e);
      } else {
        el[clickoutsideContext].bindingFn(e);
      }
    };
    // eslint-disable-next-line
    el[clickoutsideContext] = {
      documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value,
    };
    setTimeout(() => {
      document.addEventListener('click', documentHandler);
    }, 0);
  },
  update(el, binding) {
    // eslint-disable-next-line
    el[clickoutsideContext].methodName = binding.expression;
    // eslint-disable-next-line
    el[clickoutsideContext].bindingFn = binding.value;
  },
  unbind(el) {
    const handler = el[clickoutsideContext].documentHandler;
    document.removeEventListener('click', handler);
  },
};

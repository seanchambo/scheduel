export abstract class BasePlugin<ComponentPropsType> {
  abstract createComponentClass: () => React.ComponentClass<ComponentPropsType>;
}
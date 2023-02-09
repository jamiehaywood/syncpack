import type {
  Config,
  DependencyType,
  ValidRange,
} from '../../get-config/config';
import type { InternalConfig } from '../../get-config/internal-config';
import type { Instance } from '../../get-package-json-files/package-json-file/instance';

export class SemverGroup {
  /** */
  dependencies: string[];
  /** Optionally limit this group to dependencies of the provided types */
  dependencyTypes?: DependencyType[];
  /** */
  input: InternalConfig;
  /** */
  instances: Instance[];
  /** */
  instancesByName: Record<string, Instance[]>;
  /** */
  isDefault: boolean;
  /** Optionally force syncpack to ignore all dependencies in this group */
  isIgnored: boolean;
  /** */
  packages: string[];
  /** The semver range which dependencies in this group should use */
  range: ValidRange;

  constructor(input: InternalConfig, semverGroup: Config.SemverGroup.Any) {
    type Ignored = Config.SemverGroup.Ignored;
    type WithRange = Config.SemverGroup.WithRange;

    this.dependencies = semverGroup.dependencies;
    this.input = input;
    this.instances = [];
    this.instancesByName = {};
    this.isDefault = semverGroup === input.defaultSemverGroup;
    this.isIgnored = (semverGroup as Ignored).isIgnored === true;
    this.packages = semverGroup.packages;
    this.range = (semverGroup as WithRange).range;

    this.isMismatch = this.isMismatch.bind(this);
  }

  /** Does this `Instance` not follow the rules of this group? */
  isMismatch(instance: Instance) {
    return !instance.hasRange(this.range);
  }

  /** 1+ `Instance` has a version which does not follow the rules */
  hasMismatches() {
    return !this.isIgnored && this.instances.some(this.isMismatch);
  }

  /** Get every `Instance` with a version which does not follow the rules */
  getMismatches(): [string, Instance[]][] {
    return Object.entries(this.instancesByName)
      .filter(([, instances]) => instances.some(this.isMismatch))
      .map(([name, instances]) => [name, instances.filter(this.isMismatch)]);
  }
}

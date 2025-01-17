import { formatCli } from '../../src/bin-format/format-cli';
import { mockPackage } from '../mock';
import { createScenario } from './lib/create-scenario';

/** "repository" contains a github URL which can be shortened further */
describe('format: GitHub shorthand', () => {
  function getScenario() {
    return createScenario(
      [
        {
          path: 'packages/a/package.json',
          before: mockPackage('a', {
            omitName: true,
            otherProps: {
              repository: {
                url: 'git://github.com/User/repo',
                type: 'git',
              },
            },
          }),
          after: mockPackage('a', {
            omitName: true,
            otherProps: {
              repository: 'User/repo',
            },
          }),
        },
      ],
      {},
    );
  }

  describe('fix-mismatches', () => {
    //
  });

  describe('format', () => {
    it('uses github shorthand format for "repository"', () => {
      const scenario = getScenario();
      formatCli(scenario.config, scenario.disk);
      expect(scenario.disk.writeFileSync.mock.calls).toEqual([
        scenario.files['packages/a/package.json'].diskWriteWhenChanged,
      ]);
      expect(scenario.log.mock.calls).toEqual([
        scenario.files['packages/a/package.json'].logEntryWhenChanged,
      ]);
    });
  });

  describe('lint-semver-ranges', () => {
    //
  });

  describe('list-mismatches', () => {
    //
  });

  describe('list', () => {
    //
  });

  describe('set-semver-ranges', () => {
    //
  });
});

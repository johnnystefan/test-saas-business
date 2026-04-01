/**
 * SwcTargetPlugin
 *
 * NX's NxAppWebpackPlugin hardcodes the swc-loader config in
 * compiler-loaders.js without a `jsc.target` — meaning SWC defaults to ES5.
 *
 * When a NestJS service extends a native ES6 class (e.g. PrismaClient,
 * PassportStrategy), SWC compiles `class Foo extends Bar` into
 * `Bar.apply(this, args)` — which throws:
 *   TypeError: Class constructor Bar cannot be invoked without 'new'
 *
 * This plugin runs AFTER NxAppWebpackPlugin.apply() and mutates the swc-loader
 * rule already registered in `compiler.options.module.rules`, injecting
 * `jsc.target` into the existing options object (no duplicate rules).
 *
 * Usage — add AFTER NxAppWebpackPlugin in webpack.config.js:
 *   const SwcTargetPlugin = require('../../swc-target-plugin');
 *   plugins: [
 *     new NxAppWebpackPlugin({ ... }),
 *     new SwcTargetPlugin({ target: 'es2022' }),
 *   ]
 */
class SwcTargetPlugin {
  constructor({ target = 'es2022' } = {}) {
    this.target = target;
  }

  apply(compiler) {
    // 'afterPlugins' fires synchronously after all plugin.apply() calls finish,
    // which means NxAppWebpackPlugin has already populated module.rules.
    compiler.hooks.afterPlugins.tap('SwcTargetPlugin', () => {
      const rules = compiler.options.module?.rules ?? [];
      let patched = 0;

      for (const rule of rules) {
        if (
          rule &&
          typeof rule === 'object' &&
          !Array.isArray(rule) &&
          typeof rule.loader === 'string' &&
          rule.loader.includes('swc-loader') &&
          rule.options &&
          typeof rule.options === 'object'
        ) {
          // Merge jsc.target into the existing jsc options without touching
          // anything else (parser, transform, loose, etc.).
          rule.options.jsc = {
            ...(rule.options.jsc ?? {}),
            target: this.target,
          };
          patched++;
        }
      }

      if (patched === 0 && process.env.NX_VERBOSE_LOGGING === 'true') {
        console.warn(
          '[SwcTargetPlugin] Warning: no swc-loader rule found to patch. ' +
            'Make sure this plugin is placed AFTER NxAppWebpackPlugin.',
        );
      }
    });
  }
}

module.exports = SwcTargetPlugin;

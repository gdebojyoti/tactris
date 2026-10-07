# Webpack 5 with Module Federation instead of Vite

Tactris is built with Webpack 5 and its built-in `ModuleFederationPlugin`, rather than a lighter dev-focused tool like Vite, because it is intended to become a remote inside a larger Webpack 5 Module Federation host. Using the host's bundler from day one avoids behavioural mismatches between federation implementations that would otherwise only surface at integration time.

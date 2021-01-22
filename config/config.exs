# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of Mix.Config.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
use Mix.Config

# Configure Mix tasks and generators
config :colabo,
  ecto_repos: [Colabo.Repo]

config :colabo_web,
  ecto_repos: [Colabo.Repo],
  generators: [context_app: :colabo]

# Configures the endpoint
config :colabo_web, ColaboWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "pIKlawJmMiLordide/PyrAwc08TD/dFLqb+hZ60gydV+QKfd+CqEAocLa/7MKxNv",
  render_errors: [view: ColaboWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Colabo.PubSub,
  live_view: [signing_salt: "B4ny86qV"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

# Colabo.Umbrella
## Prueba técnica Elixir

Después de hacer git clone:

```
cd colabo_umbrella
mix deps.get
mix compile
cd apps/colabo_web/assets
npm install
cd ../../..
iex -S mix phx.server
```

La aplicación web debería estar disponible en [http://localhost:4000](http://localhost:4000)
echo off
for %%f in (tests\*.js) do (
  run.bat %%f
)
rem pre: assumes the main flexagonator project was built and copied into appropriate idyll/components files
rem post: requires the .html files to be fixed up to point to static/<project>/idyll_index.js files

copy contents.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\index.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\index\idyll_index.js"
del index.idyll

copy flex-compendium.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\flex-compendium.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\flex-compendium\idyll_index.js"
del index.idyll

copy flex-sequences.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\flex-sequences.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\flex-sequences\idyll_index.js"
del index.idyll

copy flexing.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\flexing.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\flexing\idyll_index.js"
del index.idyll

copy generators.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\generators.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\generators\idyll_index.js"
del index.idyll

copy new-flexes.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\new-flexes.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\new-flexes\idyll_index.js"
del index.idyll

copy pinch-flex.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\pinch-flex.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\pinch-flex\idyll_index.js"
del index.idyll

copy pinch-variations.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\pinch-variations.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\pinch-variations\idyll_index.js"
del index.idyll

copy playground.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\playground.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\playground\idyll_index.js"
del index.idyll

copy slot-flexes.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\slot-flexes.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\slot-flexes\idyll_index.js"
del index.idyll

copy references.idyll index.idyll
call idyll build
copy build\index.html "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\references.html"
copy build\static\idyll_index.js "C:\Users\Scott Sherman\Documents\loki3.com\flex\explore\references\idyll_index.js"
del index.idyll

rem remember to fix up references to js files

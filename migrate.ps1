$templatePath = 'c:\Users\HP\Documents\islamicfiqhpublishing-main\articles\nitisart\moon-sighting-vs-astronomy.html'
$templateContent = Get-Content $templatePath -Raw -Encoding UTF8

function Migrate-Article {
    param ($targetPath)
    
    $content = Get-Content $targetPath -Raw -Encoding UTF8
    
    # 1. Extract metadata
    if ($content -match '(?is)<title>(.*?)</title>') { $title = $matches[1] } else { $title = 'No Title' }
    if ($content -match '(?is)<meta name="description" content="(.*?)">') { $desc = $matches[1] } else { $desc = '' }
    if ($content -match '(?is)<h1[^>]*>(.*?)</h1>') { $h1 = $matches[1] } else { $h1 = 'No Title' }
    if ($content -match '(?is)<div>(\d+ พฤษภาคม 2569)</div>') { $date = $matches[1] } else { $date = '18 พฤษภาคม 2569' }
    if ($content -match '(?is)อ่าน (\d+) นาที') { $readTime = $matches[1] } else { $readTime = '20' }
    if ($content -match '(?is)<meta property="og:url" content="(.*?)">') { $url = $matches[1] } else { $url = '' }

    # 2. Extract body
    if ($content -match '(?is)</h1>.*?(<p class="lead-text">|<p>|<h2>)(.*?)<div class="citation-box"') {
        $bodyContent = $matches[1] + $matches[2]
    } elseif ($content -match '(?is)</h1>.*?(<p class="lead-text">|<p>|<h2>)(.*?)</article>') {
        $bodyContent = $matches[1] + $matches[2]
    } else {
        Write-Host "Failed to extract body for $targetPath"
        return
    }

    # Clean up the body by removing the old citation box and share box if any
    $bodyContent = $bodyContent -replace '(?is)<div class="citation-box">.*?</div>\s*</div>', ''
    $bodyContent = $bodyContent -replace '(?is)<hr>', '' # remove <hr> before references to let CSS handle it

    # 3. Inject into template
    $newContent = $templateContent
    
    # Replace metadata
    $newContent = $newContent -replace '(?is)<title>.*?</title>', "<title>$title</title>"
    $newContent = $newContent -replace '(?is)<meta name="description" content=".*?">', "<meta name=`"description`" content=`"$desc`">"
    $newContent = $newContent -replace '(?is)<meta property="og:title" content=".*?">', "<meta property=`"og:title`" content=`"$h1 — Islamic Fiqh Publishing`">"
    $newContent = $newContent -replace '(?is)<meta property="og:description" content=".*?">', "<meta property=`"og:description`" content=`"$desc`">"
    $newContent = $newContent -replace '(?is)<meta property="og:url" content=".*?">', "<meta property=`"og:url`" content=`"$url`">"
    
    # Replace H1
    $newContent = $newContent -replace '(?is)<h1 class="article-main-title" lang="th">.*?</h1>', "<h1 class=`"article-main-title`" lang=`"th`">$h1</h1>"
    
    # Replace Date & Read Time
    $newContent = $newContent -replace '(?is)<span>\d+ พฤษภาคม 2569</span>', "<span>$date</span>"
    $newContent = $newContent -replace '(?is)<span>อ่าน \d+ นาที</span>', "<span>อ่าน $readTime นาที</span>"
    
    # Replace Body
    # We replace everything inside <div class="article-body" id="main-content"> ... </div> <div class="social-share-container">
    $newContent = $newContent -replace '(?is)(<div class="article-body" id="main-content">).*?(<div class="citation-box">)', "`$1`n$bodyContent`n`n`$2"
    
    # Replace Citation URL/Title
    $citationText = "กองบรรณาธิการ. (2569). $h1. Islamic Fiqh Publishing. สืบค้นจาก $url"
    $newContent = $newContent -replace '(?is)<div class="citation-text" id="citationText">.*?</div>', "<div class=`"citation-text`" id=`"citationText`">$citationText</div>"

    Set-Content -Path $targetPath -Value $newContent -Encoding UTF8
    Write-Host "Successfully migrated $targetPath"
}

Migrate-Article 'c:\Users\HP\Documents\islamicfiqhpublishing-main\articles\nitisart\darurah-vs-hajah.html'
Migrate-Article 'c:\Users\HP\Documents\islamicfiqhpublishing-main\articles\nitisart\usul-al-fiqh-foundation.html'

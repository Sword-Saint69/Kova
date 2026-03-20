$counter = 1

while ($true) {
    $msg = "1.$counter"

    # Add all changes
    git add .

    # Try commit (won’t fail script if nothing to commit)
    git commit -m $msg 2>$null

    # Push
    git push

    Write-Host "Pushed with message: $msg"

    $counter++

    Start-Sleep -Seconds 60
}
# Workspace identical-asset deduplication

After fetching the current branch, the scratch volume had no available space. User previously authorized preserving data and reclaiming duplicate storage. Compared assets in two older workspace copies by SHA-256, size and mode, and replaced only identical copies with hard links. Both paths and bytes remain accessible; no source, Git history or backup was deleted.

3643 identical assets, 2,993,477,096 bytes shared. Volume reported 2.8 GiB available afterward. Copies involved: `/workspace/scratch/8bb5fbf92507/farm-edit/assets` and `/workspace/scratch/8bb5fbf92507/japan-app-review/assets`. These asset paths now share inodes: future edits in either archival copy must first replace the target with an independent copy. Active dialogue checkout is separate. User computer storage was not touched.

# Details

Date : 2024-07-20 16:17:23

Directory d:\\vite-npm\\file-manager\\src\\lib

Total : 76 files,  4996 codes, 122 comments, 595 blanks, all 5713 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/lib/api/index.ts](/src/lib/api/index.ts) | TypeScript | 112 | 0 | 13 | 125 |
| [src/lib/assets/vue.svg](/src/lib/assets/vue.svg) | XML | 1 | 0 | 0 | 1 |
| [src/lib/command/dir/copy.ts](/src/lib/command/dir/copy.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/lib/command/dir/delete.ts](/src/lib/command/dir/delete.ts) | TypeScript | 67 | 0 | 5 | 72 |
| [src/lib/command/dir/mkdir.ts](/src/lib/command/dir/mkdir.ts) | TypeScript | 16 | 0 | 5 | 21 |
| [src/lib/command/dir/move.ts](/src/lib/command/dir/move.ts) | TypeScript | 22 | 4 | 6 | 32 |
| [src/lib/command/dir/rename.ts](/src/lib/command/dir/rename.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/lib/command/download.ts](/src/lib/command/download.ts) | TypeScript | 15 | 0 | 3 | 18 |
| [src/lib/command/file/copy.ts](/src/lib/command/file/copy.ts) | TypeScript | 30 | 0 | 5 | 35 |
| [src/lib/command/file/delete.ts](/src/lib/command/file/delete.ts) | TypeScript | 67 | 0 | 4 | 71 |
| [src/lib/command/file/move.ts](/src/lib/command/file/move.ts) | TypeScript | 30 | 0 | 5 | 35 |
| [src/lib/command/file/rename.ts](/src/lib/command/file/rename.ts) | TypeScript | 12 | 0 | 5 | 17 |
| [src/lib/command/file/upload.ts](/src/lib/command/file/upload.ts) | TypeScript | 29 | 1 | 9 | 39 |
| [src/lib/command/tree-create.ts](/src/lib/command/tree-create.ts) | TypeScript | 71 | 1 | 6 | 78 |
| [src/lib/components/DirTree.tsx](/src/lib/components/DirTree.tsx) | TypeScript JSX | 300 | 6 | 27 | 333 |
| [src/lib/components/FileDir.tsx](/src/lib/components/FileDir.tsx) | TypeScript JSX | 224 | 4 | 25 | 253 |
| [src/lib/components/FileGridCard.tsx](/src/lib/components/FileGridCard.tsx) | TypeScript JSX | 336 | 3 | 27 | 366 |
| [src/lib/components/FileGridList.tsx](/src/lib/components/FileGridList.tsx) | TypeScript JSX | 7 | 0 | 2 | 9 |
| [src/lib/components/FileList.tsx](/src/lib/components/FileList.tsx) | TypeScript JSX | 24 | 1 | 5 | 30 |
| [src/lib/components/Provider.tsx](/src/lib/components/Provider.tsx) | TypeScript JSX | 41 | 0 | 2 | 43 |
| [src/lib/enum/file-action.ts](/src/lib/enum/file-action.ts) | TypeScript | 11 | 0 | 1 | 12 |
| [src/lib/enum/file-status.ts](/src/lib/enum/file-status.ts) | TypeScript | 7 | 0 | 3 | 10 |
| [src/lib/enum/index.ts](/src/lib/enum/index.ts) | TypeScript | 20 | 11 | 10 | 41 |
| [src/lib/hooks/useBreadcrumb.tsx](/src/lib/hooks/useBreadcrumb.tsx) | TypeScript JSX | 132 | 4 | 27 | 163 |
| [src/lib/hooks/useChooseFile.tsx](/src/lib/hooks/useChooseFile.tsx) | TypeScript JSX | 33 | 0 | 6 | 39 |
| [src/lib/hooks/useContextMenu.tsx](/src/lib/hooks/useContextMenu.tsx) | TypeScript JSX | 52 | 0 | 9 | 61 |
| [src/lib/hooks/useDirFiles.ts](/src/lib/hooks/useDirFiles.ts) | TypeScript | 35 | 0 | 4 | 39 |
| [src/lib/hooks/useDragToggle.tsx](/src/lib/hooks/useDragToggle.tsx) | TypeScript JSX | 72 | 5 | 10 | 87 |
| [src/lib/hooks/useFileChange.tsx](/src/lib/hooks/useFileChange.tsx) | TypeScript JSX | 206 | 0 | 15 | 221 |
| [src/lib/hooks/useFileCutAndCopy.ts](/src/lib/hooks/useFileCutAndCopy.ts) | TypeScript | 102 | 0 | 14 | 116 |
| [src/lib/hooks/useFileDragIn.ts](/src/lib/hooks/useFileDragIn.ts) | TypeScript | 41 | 0 | 10 | 51 |
| [src/lib/hooks/useFileInfoTip.tsx](/src/lib/hooks/useFileInfoTip.tsx) | TypeScript JSX | 0 | 0 | 1 | 1 |
| [src/lib/hooks/useFilePuIn.ts](/src/lib/hooks/useFilePuIn.ts) | TypeScript | 64 | 1 | 6 | 71 |
| [src/lib/hooks/useFileRename.tsx](/src/lib/hooks/useFileRename.tsx) | TypeScript JSX | 69 | 0 | 8 | 77 |
| [src/lib/hooks/useFileSelect.ts](/src/lib/hooks/useFileSelect.ts) | TypeScript | 63 | 0 | 8 | 71 |
| [src/lib/hooks/useFileSelectArea.tsx](/src/lib/hooks/useFileSelectArea.tsx) | TypeScript JSX | 156 | 4 | 18 | 178 |
| [src/lib/hooks/useImageEdit.tsx](/src/lib/hooks/useImageEdit.tsx) | TypeScript JSX | 413 | 1 | 35 | 449 |
| [src/lib/hooks/useRename.tsx](/src/lib/hooks/useRename.tsx) | TypeScript JSX | 177 | 3 | 22 | 202 |
| [src/lib/hooks/useSelectedDel.ts](/src/lib/hooks/useSelectedDel.ts) | TypeScript | 33 | 0 | 3 | 36 |
| [src/lib/hooks/useUploadProgress.tsx](/src/lib/hooks/useUploadProgress.tsx) | TypeScript JSX | 19 | 0 | 2 | 21 |
| [src/lib/icons/Copy.tsx](/src/lib/icons/Copy.tsx) | TypeScript JSX | 23 | 0 | 2 | 25 |
| [src/lib/icons/DirIcon.tsx](/src/lib/icons/DirIcon.tsx) | TypeScript JSX | 33 | 0 | 2 | 35 |
| [src/lib/icons/Empty.tsx](/src/lib/icons/Empty.tsx) | TypeScript JSX | 73 | 0 | 2 | 75 |
| [src/lib/icons/Floder.tsx](/src/lib/icons/Floder.tsx) | TypeScript JSX | 30 | 0 | 2 | 32 |
| [src/lib/icons/Move.tsx](/src/lib/icons/Move.tsx) | TypeScript JSX | 23 | 0 | 2 | 25 |
| [src/lib/index.ts](/src/lib/index.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [src/lib/src/content.tsx](/src/lib/src/content.tsx) | TypeScript JSX | 116 | 3 | 17 | 136 |
| [src/lib/src/index.tsx](/src/lib/src/index.tsx) | TypeScript JSX | 144 | 16 | 7 | 167 |
| [src/lib/src/slider.tsx](/src/lib/src/slider.tsx) | TypeScript JSX | 139 | 0 | 13 | 152 |
| [src/lib/src/toolbar.tsx](/src/lib/src/toolbar.tsx) | TypeScript JSX | 106 | 10 | 13 | 129 |
| [src/lib/style/content.less](/src/lib/style/content.less) | Less | 143 | 13 | 15 | 171 |
| [src/lib/style/dir-tree.less](/src/lib/style/dir-tree.less) | Less | 71 | 0 | 10 | 81 |
| [src/lib/style/image-editor.less](/src/lib/style/image-editor.less) | Less | 57 | 0 | 11 | 68 |
| [src/lib/style/index.less](/src/lib/style/index.less) | Less | 148 | 9 | 17 | 174 |
| [src/lib/style/slider.less](/src/lib/style/slider.less) | Less | 4 | 2 | 0 | 6 |
| [src/lib/style/toobar.less](/src/lib/style/toobar.less) | Less | 80 | 1 | 11 | 92 |
| [src/lib/types/drag.ts](/src/lib/types/drag.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/lib/types/index.ts](/src/lib/types/index.ts) | TypeScript | 26 | 1 | 5 | 32 |
| [src/lib/types/namespace.ts](/src/lib/types/namespace.ts) | TypeScript | 111 | 0 | 10 | 121 |
| [src/lib/utils/area.ts](/src/lib/utils/area.ts) | TypeScript | 11 | 5 | 6 | 22 |
| [src/lib/utils/axios.ts](/src/lib/utils/axios.ts) | TypeScript | 48 | 2 | 11 | 61 |
| [src/lib/utils/context.ts](/src/lib/utils/context.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [src/lib/utils/contextmenuOption.ts](/src/lib/utils/contextmenuOption.ts) | TypeScript | 43 | 0 | 2 | 45 |
| [src/lib/utils/date.ts](/src/lib/utils/date.ts) | TypeScript | 7 | 0 | 2 | 9 |
| [src/lib/utils/drag.ts](/src/lib/utils/drag.ts) | TypeScript | 120 | 3 | 14 | 137 |
| [src/lib/utils/event.ts](/src/lib/utils/event.ts) | TypeScript | 34 | 0 | 7 | 41 |
| [src/lib/utils/extension.ts](/src/lib/utils/extension.ts) | TypeScript | 39 | 0 | 7 | 46 |
| [src/lib/utils/from-darg.ts](/src/lib/utils/from-darg.ts) | TypeScript | 15 | 0 | 2 | 17 |
| [src/lib/utils/icon.ts](/src/lib/utils/icon.ts) | TypeScript | 13 | 0 | 2 | 15 |
| [src/lib/utils/minetype.ts](/src/lib/utils/minetype.ts) | TypeScript | 30 | 0 | 3 | 33 |
| [src/lib/utils/path.ts](/src/lib/utils/path.ts) | TypeScript | 4 | 1 | 2 | 7 |
| [src/lib/utils/pub-sub.ts](/src/lib/utils/pub-sub.ts) | TypeScript | 96 | 5 | 13 | 114 |
| [src/lib/utils/resize.ts](/src/lib/utils/resize.ts) | TypeScript | 26 | 2 | 3 | 31 |
| [src/lib/utils/size.ts](/src/lib/utils/size.ts) | TypeScript | 8 | 0 | 4 | 12 |
| [src/lib/utils/tree-node.ts](/src/lib/utils/tree-node.ts) | TypeScript | 32 | 0 | 2 | 34 |
| [src/lib/utils/uid.ts](/src/lib/utils/uid.ts) | TypeScript | 5 | 0 | 1 | 6 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)
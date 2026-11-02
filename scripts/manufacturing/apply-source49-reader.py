#!/usr/bin/env python3
"""Exact source49 ruby replay/projection; arbitrary reader changes are rejected."""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[2]
PATH='src/components/manufacturing/ManufacturingCourse.tsx'
BEFORE='c7af06d4ad1d9b6931eac852e962844f675edbf0de8a2de2fa506a94c8859dcc'
AFTER='2bab7575afe406dda1e9fc639d3b121ce58c15ba948dde99117f0994b4c2e85d'
IMPORT="import {manufacturingLessonParagraph} from '@/data/manufacturing/lesson-editorial';"
ADDED="\nimport {Source49Japanese} from './Source49Japanese';"
OLD="<Text selectable style={[s.body,{color:colors.text}]}>{manufacturingLessonParagraph(lesson,p.id,'ja',p.textJa)}</Text>"
NEW="<Source49Japanese lesson={lesson} paragraphId={p.id} text={manufacturingLessonParagraph(lesson,p.id,'ja',p.textJa)} style={[s.body,{color:colors.text}]}/>"
def sha(raw):return hashlib.sha256(raw).hexdigest()
def predecessor(raw):
 if sha(raw)!=AFTER:return raw
 text=raw.decode();assert text.count(IMPORT+ADDED)==1 and text.count(NEW)==1
 before=text.replace(IMPORT+ADDED,IMPORT).replace(NEW,OLD).encode()
 assert sha(before)==BEFORE,'Source49 exact predecessor drift'
 return before

def apply(root=ROOT):
 p=root/PATH;raw=p.read_bytes();assert sha(raw) in [BEFORE,AFTER],'Unknown reader revision; preserve it'
 if sha(raw)==AFTER:return []
 text=raw.decode();assert text.count(IMPORT)==1 and text.count(OLD)==1
 after=text.replace(IMPORT,IMPORT+ADDED).replace(OLD,NEW).encode()
 assert sha(after)==AFTER,'Source49 exact replay drift'
 p.write_bytes(after);return [PATH]
if __name__=='__main__':
 import json
 print(json.dumps({'status':'PASS','updated':apply()}))

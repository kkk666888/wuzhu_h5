#!/usr/bin/python
# -*- coding: UTF-8 -*-
#读取文件中某一行的内容
def changeLine(line):
    num = 0
    flag = -1
    newline = ''
    for letter in line:
        num += 1
        if num == flag:
            newline += letter.upper()
        else:
            newline += letter
        if letter == '\"' or letter == '_':
            flag = num + 1
    return newline.replace('_', '')

def readFileNlineContent():
    f1 = open('./GoodList.txt', 'r')
    f2 = open('./Good_new.txt', 'w+')
    line = f1.readline()
    while line:
        print line
        newline =  changeLine(line)          
        f2.write(newline)
        line = f1.readline()
    f1.close()
    f2.close()

readFileNlineContent()
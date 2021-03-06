######################################################
# DECOMPRESSES GZIP COMPRESSED FILES                 #
# Files which had 0x1F and 0x8B as the first 2 bytes #
# (like lyr2.mpz) were gzip compressed               #
######################################################

import gzip
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-i", "--input", help="input file")
parser.add_option("-o", "--output", help="output file")
(options, args) = parser.parse_args()

if (options.input != None and options.output != None):
	#fileObject = open(options.input, 'rb').read()
	with gzip.open(options.input, 'rb') as f:
		fileContents = f.read()
		outFile = open(options.output, 'wb')
		outFile.write(fileContents)
		outFile.close()
else:
	print("Please give an input and output file with -i and -o")
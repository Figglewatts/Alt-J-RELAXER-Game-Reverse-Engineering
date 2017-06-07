######################################################
# DECOMPRESSES ZLIB COMPRESSED FILES                 #
# Files which had 0x78 and 0xDA as the first 2 bytes #
# (like lvl5.mpz and tex5d.mpz) were zlib compressed #
######################################################

import zlib
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-i", "--input", help="input file")
parser.add_option("-o", "--output", help="output file")
(options, args) = parser.parse_args()

if (options.input != None and options.output != None):
	with open(options.input, 'rb') as f:
		fileContents = f.read()
		decompressed = zlib.decompress(fileContents)
		outFile = open(options.output, 'wb')
		outFile.write(decompressed)
		outFile.close()
else:
	print("Please give an input and output file with -i and -o")
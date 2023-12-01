import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { winner } from '../BMAlgorithm';

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 800,
  },
  page: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: '96px 96px',
  },
  res: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e9e9e9',
  },
  positionContainer: {
    width: '100%',
    backgroundColor: '#ffff59',
    paddingHorizontal: '10px',
    display: 'flex',
    alignItems: 'center',
  }, 
  position: {
    fontSize: 12,
    fontWeight: 600,
    paddingLeft: 10,
    padding: '10px 0 10px 10px',
    textAlign: 'left',
  },
  candidateResultContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  candidate: {
    alignItems: 'center',
  },
  candidateFullnameConatiner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
    gap: 10
  },
  candidateFullname: {
    fontSize: 12,
    fontWeight: 600,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const PDFResult = ({ result, orgname }: { result: any, orgname: string }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{orgname} Election Winners</Text>
      {result?.sort((a: any, b: any) => a.position_order - b.position_order).map((position: any, index: any) => (
        <View key={index} style={styles.res}>
          <View style={styles.positionContainer}>
            <Text style={styles.position}>{position.position}</Text>
          </View>
          <View style={styles.candidateResultContainer}>
            {Number(position?.requiredWinner) > 1
              ? position?.candidates
                  ?.sort((a: any, b: any) => b.count - a.count)
                  .slice(0, Number(position.requiredWinner))
                  .map((candidate: any, idx: any) => (
                    <View key={idx} style={styles.candidate}>
                      <View style={styles.candidateFullnameConatiner}>
                        <Text style={styles.candidateFullname}>{candidate.fullname}</Text>
                        <Text>{candidate.count}</Text>
                      </View>
                    </View>
                  ))
              : position?.candidates
                  ?.filter((candidate: any) => winner(position?.voted_candidates)?.includes(candidate.id))
                  .map((candidate: any, idx: any) => (
                    <View key={idx} style={styles.candidate}>
                      <View style={styles.candidateFullnameConatiner}>
                        <Text style={styles.candidateFullname}>{candidate.fullname}</Text>
                      </View>
                    </View>
                  ))}
          </View>
        </View>
      ))}
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
        }/>
    </Page>
  </Document>
);

export default PDFResult;
